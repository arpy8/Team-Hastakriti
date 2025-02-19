#include <Arduino.h>
#include <Ticker.h>
#include "EMGFilters.h"
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// ==================== Number of EMG Sensors ====================
#define NUM_SENSORS 2

// ==================== PWMBOARD Definitions ====================
Adafruit_PWMServoDriver pwmDriver = Adafruit_PWMServoDriver(0x40);

// Define motor channels
const int INDEX_MIDDLE = 0;  // Motor for index and middle fingers
const int RING_PINKY = 1;    // Motor for ring and pinky fingers
const int THUMB = 2;         // Motor for thumb

// Initial positions
const int INDEX_MIDDLE_INITIAL = 180;
const int RING_PINKY_INITIAL = 0;
const int THUMB_INITIAL = 0;

// Active positions
const int INDEX_MIDDLE_ACTIVE = 50;
const int RING_PINKY_ACTIVE = 130;
const int THUMB_ACTIVE = 60;

#define SERVOMIN  125
#define SERVOMAX  625

// ==================== Pin Definitions ====================
const int SensorInputPins[NUM_SENSORS] = {33,32}; // ADC pins for each sensor
const int ledPins[NUM_SENSORS] = {2, 4};           // LEDs or GPIOs for indicating states

// ==================== EMG Filter Configuration ====================
EMGFilters myFilter[NUM_SENSORS];
SAMPLE_FREQUENCY sampleRate = SAMPLE_FREQ_1000HZ;
NOTCH_FREQUENCY humFreq = NOTCH_FREQ_50HZ;

// ==================== Calibration Parameters ====================
const unsigned long calibrationTime = 5000; // Total calibration time (5 seconds)
float restLevel[NUM_SENSORS] = {0.0};
float activeLevel[NUM_SENSORS] = {0.0};

// ==================== Threshold Parameters ====================
float UpperThreshold[NUM_SENSORS] = {0.0};
float LowerThreshold[NUM_SENSORS] = {0.0};

// ==================== Signal Smoothing Parameters ====================
const int smoothingWindowSize = 50;
float smoothingBuffer[NUM_SENSORS][smoothingWindowSize] = {0};
int smoothingIndex[NUM_SENSORS] = {0};
float smoothingSum[NUM_SENSORS] = {0.0};
bool bufferFilled[NUM_SENSORS] = {false};

// ==================== State Machine States ====================
enum EMGState { IDLE, ACTIVE };
EMGState currentState[NUM_SENSORS] = {IDLE};

// ==================== Debounce Parameters ====================
const unsigned long stateChangeDelay = 300; // 300ms debounce
unsigned long lastStateChangeTime[NUM_SENSORS] = {0};

// ==================== Volatile Variables ====================
volatile int Value[NUM_SENSORS] = {0};
volatile bool newData = false;  // Since we use the same tick for both sensors

// ==================== Ticker Setup ====================
Ticker timerTicker;

// ==================== ISR for Timer ====================
void onTick() {
    newData = true;
}

void setup() {
    analogSetPinAttenuation(SensorInputPins[0], ADC_11db);
    analogSetPinAttenuation(SensorInputPins[1], ADC_11db);

    // Initialize Serial Communication
    Serial.begin(115200);
    while (!Serial); // Wait for Serial to initialize

    // Initialize I2C Communication
    Wire.begin(21, 22); // SDA=21, SCL=22
    Serial.println("Dual EMG Sensor System Initialization");

    // Initialize PWM Driver
    pwmDriver.begin();
    pwmDriver.setPWMFreq(60); // Set frequency to 60 Hz for servos
    Serial.println("PWM Servo Driver Initialized.");

    // Set initial positions
    setMotorAngle(INDEX_MIDDLE, INDEX_MIDDLE_INITIAL);
    setMotorAngle(RING_PINKY, RING_PINKY_INITIAL);
    setMotorAngle(THUMB, THUMB_INITIAL);

    // Initialize LED Pins
    for (int i = 0; i < NUM_SENSORS; i++) {
        pinMode(ledPins[i], OUTPUT);
        digitalWrite(ledPins[i], LOW); // Ensure LEDs are off initially
    }

    // Initialize EMG Filters
    for (int i = 0; i < NUM_SENSORS; i++) {
        myFilter[i].init(sampleRate, humFreq, true, true, true);
    }
    Serial.println("EMG Filters Initialized.");

    // Set ADC resolution and attenuation
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);

    // Initialize Ticker for 1ms interval
    timerTicker.attach_ms(1, onTick); // 1ms interval

    // Calibration
    calibrateEMG();

    Serial.println("System Ready.");
}

void loop() {
    if (newData) {
        newData = false;

        for (int i = 0; i < NUM_SENSORS; i++) {
            // Read and process EMG signals
            Value[i] = analogRead(SensorInputPins[i]);
            float DataAfterFilter = myFilter[i].update(Value[i]);
            float envelope = abs(DataAfterFilter);

            // Smoothing logic
            smoothingSum[i] -= smoothingBuffer[i][smoothingIndex[i]];
            smoothingBuffer[i][smoothingIndex[i]] = envelope;
            smoothingSum[i] += smoothingBuffer[i][smoothingIndex[i]];
            smoothingIndex[i]++;
            if (smoothingIndex[i] >= smoothingWindowSize) {
                smoothingIndex[i] = 0;
                bufferFilled[i] = true;
            }

            float smoothedEnvelope = smoothingSum[i] / (bufferFilled[i] ? smoothingWindowSize : smoothingIndex[i]);

            // Send data to Serial Monitor
            Serial.print("Sensor");
            Serial.print(i);
            Serial.print(": Raw=");
            Serial.print(Value[i]);
            Serial.print(" Filtered=");
            Serial.print(DataAfterFilter);
            Serial.print(" Envelope=");
            Serial.println(smoothedEnvelope);

            // State machine logic with debouncing
            unsigned long currentTime = millis();

            switch (currentState[i]) {
                case IDLE:
                    if (smoothedEnvelope > UpperThreshold[i]) {
                        if (currentTime - lastStateChangeTime[i] > stateChangeDelay) {
                            currentState[i] = ACTIVE;
                            digitalWrite(ledPins[i], HIGH);

                            // Sensor 0 controls INDEX_MIDDLE and RING_PINKY
                            if (i == 0) {
                                setMotorAngle(INDEX_MIDDLE, INDEX_MIDDLE_ACTIVE);
                                setMotorAngle(RING_PINKY, RING_PINKY_ACTIVE);
                            }
                            // Sensor 1 controls THUMB
                            else if (i == 1) {
                                setMotorAngle(THUMB, THUMB_ACTIVE);
                            }

                            lastStateChangeTime[i] = currentTime;
                            Serial.print("Sensor ");
                            Serial.print(i);
                            Serial.println(": State changed to ACTIVE");
                        }
                    }
                    break;

                case ACTIVE:
                    if (smoothedEnvelope < LowerThreshold[i]) {
                        if (currentTime - lastStateChangeTime[i] > stateChangeDelay) {
                            currentState[i] = IDLE;
                            digitalWrite(ledPins[i], LOW);

                            // Return to initial positions
                            if (i == 0) {
                                setMotorAngle(INDEX_MIDDLE, INDEX_MIDDLE_INITIAL);
                                setMotorAngle(RING_PINKY, RING_PINKY_INITIAL);
                            }
                            else if (i == 1) {
                                setMotorAngle(THUMB, THUMB_INITIAL);
                            }

                            lastStateChangeTime[i] = currentTime;
                            Serial.print("Sensor ");
                            Serial.print(i);
                            Serial.println(": State changed to IDLE");
                        }
                    }
                    break;
            }
        }
    }
}

void calibrateEMG() {
    for (int i = 0; i < NUM_SENSORS; i++) {
        unsigned long startTime = millis();
        float restSum = 0.0;
        float activeSum = 0.0;
        int restCount = 0;
        int activeCount = 0;

        // Calibration Phase 1: Rest
        Serial.print("Calibrating Sensor ");
        Serial.print(i);
        Serial.println(". Please keep your muscle relaxed for calibration...");
        while (millis() - startTime < calibrationTime / 2) {
            if (newData) {
                newData = false;
                int sensorValue = analogRead(SensorInputPins[i]);
                float filtered = myFilter[i].update(sensorValue);
                float env = abs(filtered);
                restSum += env;
                restCount++;
            }
        }

        restLevel[i] = (restCount > 0) ? (restSum / restCount) : 0;

        // Calibration Phase 2: Active
        Serial.print("Now, please contract your muscle for calibration of Sensor ");
        Serial.print(i);
        Serial.println("...");
        unsigned long activeStartTime = millis();
        while (millis() - activeStartTime < calibrationTime / 2) {
            if (newData) {
                newData = false;
                int sensorValue = analogRead(SensorInputPins[i]);
                float filtered = myFilter[i].update(sensorValue);
                float env = abs(filtered);
                activeSum += env;
                activeCount++;
            }
        }

        activeLevel[i] = (activeCount > 0) ? (activeSum / activeCount) : 0;

        // Set thresholds
        UpperThreshold[i] = (restLevel[i] + activeLevel[i]) / 2 + (activeLevel[i] - restLevel[i]) * 0.2;
        LowerThreshold[i] = (restLevel[i] + activeLevel[i]) / 2 - (activeLevel[i] - restLevel[i]) * 0.2;

        // Output calibration results
        Serial.print("Sensor ");
        Serial.print(i);
        Serial.println(" Calibration complete.");
        Serial.print("Rest Level: ");
        Serial.println(restLevel[i]);
        Serial.print("Active Level: ");
        Serial.println(activeLevel[i]);
        Serial.print("UpperThreshold: ");
        Serial.println(UpperThreshold[i]);
        Serial.print("LowerThreshold: ");
        Serial.println(LowerThreshold[i]);

        delay(1000);
    }
}

void setMotorAngle(int motorChannel, int angle) {
    int pulse = angleToPulse(angle);
    pwmDriver.setPWM(motorChannel, 0, pulse);
}

int angleToPulse(int ang) {
    return map(ang, 0, 180, SERVOMIN, SERVOMAX);
}
