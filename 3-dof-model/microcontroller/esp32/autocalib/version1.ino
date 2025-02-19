#include <Arduino.h>
   #include <Ticker.h>
    #include "EMGFilters.h"

    // ==================== Pin Definitions ====================
    const int SensorInputPin = 2; // ADC1_CH6
    // const int ledPin = 2; // Onboard LED

    // ==================== EMG Filter Configuration ====================
    EMGFilters myFilter;
    SAMPLE_FREQUENCY sampleRate = SAMPLE_FREQ_1000HZ;
    NOTCH_FREQUENCY humFreq = NOTCH_FREQ_50HZ;

    // ==================== Calibration Parameters ====================
    const unsigned long calibrationTime = 5000; // 5 seconds for calibration
    float restLevel = 0.0;
    float activeLevel = 0.0;

    // ==================== Threshold Parameters ====================
    float UpperThreshold = 0.0;
    float LowerThreshold = 0.0;

    // ==================== Signal Smoothing Parameters ====================
    const int smoothingWindowSize = 50;
    float smoothingBuffer[smoothingWindowSize] = {0};
    int smoothingIndex = 0;
    float smoothingSum = 0.0;
    bool bufferFilled = false;

    // ==================== State Machine States ====================
    enum EMGState { IDLE, ACTIVE };
    EMGState currentState = IDLE;

    // ==================== Debounce Parameters ====================
    const unsigned long stateChangeDelay = 300; // 300ms
    unsigned long lastStateChangeTime = 0;

    // ==================== Volatile Variables ====================
    volatile int Value = 0;
    volatile bool newData = false;

    // ==================== Ticker Setup ====================
    Ticker timerTicker;

    void onTick() {
        newData = true;
    }

    void setup() {
        // Initialize Serial Communication
        Serial.begin(115200);
        Serial.println("EMG Filter Initialized.");

        // Initialize the onboard LED pin as OUTPUT
        // pinMode(ledPin, OUTPUT);
        // digitalWrite(ledPin, LOW); // Ensure LED is off initially

        // Initialize EMG Filter
        myFilter.init(sampleRate, humFreq, true, true, true);

        // Set ADC resolution
        analogReadResolution(12);
        analogSetAttenuation(ADC_11db); // Adjust as needed

        // Initialize Ticker for 1ms interval
        timerTicker.attach_ms(1, onTick); // 1ms interval

        // ==================== Calibration ====================
        Serial.println("Starting calibration...");
        calibrateEMG();
        Serial.println("Calibration complete.");
        Serial.print("Rest Level: ");
        Serial.println(restLevel);
        Serial.print("Active Level: ");
        Serial.println(activeLevel);

        // Set thresholds based on calibration
        UpperThreshold = (restLevel + activeLevel) / 2 + (activeLevel - restLevel) * 0.2;
        LowerThreshold = (restLevel + activeLevel) / 2 - (activeLevel - restLevel) * 0.2;

        Serial.print("UpperThreshold: ");
        Serial.println(UpperThreshold);
        Serial.print("LowerThreshold: ");
        Serial.println(LowerThreshold);
    }

    void loop() {
        if (newData) {
            newData = false;

            // Read the sensor value
            Value = analogRead(SensorInputPin);

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

            // switch (currentState) {
            //     case IDLE:
            //         if (smoothedEnvelope > UpperThreshold) {
            //             if (currentTime - lastStateChangeTime > stateChangeDelay) {
            //                 currentState = ACTIVE;
            //                 digitalWrite(ledPin, HIGH); // Turn LED on
            //                 lastStateChangeTime = currentTime;
            //                 Serial.println("State changed to ACTIVE");
            //             }
            //         }
            //         break;

            //     case ACTIVE:
            //         if (smoothedEnvelope < LowerThreshold) {
            //             if (currentTime - lastStateChangeTime > stateChangeDelay) {
            //                 currentState = IDLE;
            //                 digitalWrite(ledPin, LOW);  // Turn LED off
            //                 lastStateChangeTime = currentTime;
            //                 Serial.println("State changed to IDLE");
            //             }
            //         }
            //         break;
            // }
        }
    }

    void calibrateEMG() {
        unsigned long startTime = millis();
        float restSum = 0.0;
        float activeSum = 0.0;
        int restCount = 0;
        int activeCount = 0;

        // Calibration Phase 1: Rest
        Serial.println("Please keep your hand relaxed for calibration...");
        while (millis() - startTime < calibrationTime / 2) {
            if (newData) {
                newData = false;
                int sensorValue = analogRead(SensorInputPin);
                float filtered = myFilter.update(sensorValue);
                float env = abs(filtered);
                restSum += env;
                restCount++;
            }
        }

        restLevel = (restCount > 0) ? (restSum / restCount) : 0;

        // Calibration Phase 2: Active
        Serial.println("Now, please perform the action (e.g., close your hand) for calibration...");
        unsigned long activeStartTime = millis();
        while (millis() - activeStartTime < calibrationTime / 2) {
            if (newData) {
                newData = false;
                int sensorValue = analogRead(SensorInputPin);
                float filtered = myFilter.update(sensorValue);
                float env = abs(filtered);
                activeSum += env;
                activeCount++;
            }
        }

        activeLevel = (activeCount > 0) ? (activeSum / activeCount) : 0;
    }
