#include <Arduino.h>
#include "EMGFilters.h"

#define SensorInputPin A0 // Input pin number

EMGFilters myFilter;
const int sampleRate = SAMPLE_FREQ_1000HZ;
const int humFreq = NOTCH_FREQ_50HZ;

// Calibration parameters
const unsigned long calibrationTime = 5000; // 5 seconds for calibration
float restLevel = 0.0;
float activeLevel = 0.0;

// Threshold parameters (to be set after calibration)
float UpperThreshold = 0.0;
float LowerThreshold = 0.0;

// Signal smoothing parameters
const int smoothingWindowSize = 50; // Number of samples for moving average
float smoothingBuffer[smoothingWindowSize];
int smoothingIndex = 0;
float smoothingSum = 0.0;
bool bufferFilled = false;

// State machine states
enum EMGState { IDLE, ACTIVE };
EMGState currentState = IDLE;

// Debounce parameters
const unsigned long stateChangeDelay = 300; // 300ms delay to confirm state change
unsigned long lastStateChangeTime = 0;

// Define the onboard LED pin
const int ledPin = LED_BUILTIN; // Use LED_BUILTIN for portability

volatile int Value = 0;
volatile bool newData = false;

// Timer interrupt service routine
void ISR_Timer() {
    Value = analogRead(SensorInputPin);
    newData = true;
}

void setup() {
    // Initialize the EMG filter
    myFilter.init(sampleRate, humFreq, true, true, true);

    // Initialize serial communication
    Serial.begin(115200);
    Serial.println("EMG Filter Initialized.");

    // Initialize the onboard LED pin as OUTPUT
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW); // Ensure LED is off initially

    // Configure Timer1 for sampling at precise intervals (1ms for 1000Hz)
    noInterrupts();           // Disable all interrupts
    TCCR1A = 0;
    TCCR1B = 0;
    OCR1A = 15999;            // Compare match register for 1ms (assuming 16MHz clock and prescaler of 1)
    TCCR1B |= (1 << WGM12);   // CTC mode
    TCCR1B |= (1 << CS10);    // Prescaler = 1
    TIMSK1 |= (1 << OCIE1A);  // Enable timer compare interrupt
    interrupts();             // Enable all interrupts

    // Start calibration
    Serial.println("Starting calibration...");
    calibrateEMG();
    Serial.println("Calibration complete.");
    Serial.print("Rest Level: ");
    Serial.println(restLevel);
    Serial.print("Active Level: ");
    Serial.println(activeLevel);

    // Set thresholds based on calibration
    UpperThreshold = (restLevel + activeLevel) / 2 + (activeLevel - restLevel) * 0.2; // 20% above midpoint
    LowerThreshold = (restLevel + activeLevel) / 2 - (activeLevel - restLevel) * 0.2; // 20% below midpoint

    Serial.print("UpperThreshold: ");
    Serial.println(UpperThreshold);
    Serial.print("LowerThreshold: ");
    Serial.println(LowerThreshold);
}

// Timer1 interrupt service routine
ISR(TIMER1_COMPA_vect) {
    ISR_Timer();
}

void loop() {
    if (newData) {
        newData = false;

        // Filter processing
        float DataAfterFilter = myFilter.update(Value);

        // Envelope detection
        float envelope = abs(DataAfterFilter);

        // Smoothing using moving average
        smoothingSum -= smoothingBuffer[smoothingIndex];
        smoothingBuffer[smoothingIndex] = envelope;
        smoothingSum += smoothingBuffer[smoothingIndex];
        smoothingIndex = (smoothingIndex + 1) % smoothingWindowSize;
        if (smoothingIndex == 0) bufferFilled = true;

        float smoothedEnvelope = smoothingSum / (bufferFilled ? smoothingWindowSize : smoothingIndex);

        // Send smoothed data to Serial Monitor (for graphing)
        Serial.println(smoothedEnvelope);

        // State machine logic with debouncing
        unsigned long currentTime = millis();

        switch (currentState) {
            case IDLE:
                if (smoothedEnvelope > UpperThreshold) {
                    if (currentTime - lastStateChangeTime > stateChangeDelay) {
                        currentState = ACTIVE;
                        digitalWrite(ledPin, HIGH); // Turn LED on
                        lastStateChangeTime = currentTime;
                        Serial.println("State changed to ACTIVE");
                    }
                }
                break;

            case ACTIVE:
                if (smoothedEnvelope < LowerThreshold) {
                    if (currentTime - lastStateChangeTime > stateChangeDelay) {
                        currentState = IDLE;
                        digitalWrite(ledPin, LOW);  // Turn LED off
                        lastStateChangeTime = currentTime;
                        Serial.println("State changed to IDLE");
                    }
                }
                break;
        }
    }
}

void calibrateEMG() {
    unsigned long startTime = millis();
    float restSum = 0.0;
    float activeSum = 0.0;
    int count = 0;

    Serial.println("Please keep your hand relaxed for calibration...");
    // Collect rest data
    while (millis() - startTime < calibrationTime / 2) {
        // Wait and collect rest data
        // Ensure ISR_Timer() has read data
        if (newData) {
            newData = false;
            float filtered = myFilter.update(analogRead(SensorInputPin));
            float env = abs(filtered);
            restSum += env;
            count++;
        }
    }

    restLevel = (count > 0) ? (restSum / count) : 0;

    Serial.println("Now, please perform the action (e.g., close your hand) for calibration...");
    // Collect active data
    unsigned long activeStartTime = millis();
    while (millis() - activeStartTime < calibrationTime / 2) {
        // Wait and collect active data
        if (newData) {
            newData = false;
            float filtered = myFilter.update(analogRead(SensorInputPin));
            float env = abs(filtered);
            activeSum += env;
            count++;
        }
    }

    activeLevel = (count > 0) ? (activeSum / count) : 0;
}
