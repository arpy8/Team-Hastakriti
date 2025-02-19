#include "server.h"
#include <Ticker.h>
#include "EMGFilters.h"

#define LED_PIN 2
#define SENSOR_PIN A0
#define CALIBRATION_TIME 5000
#define SMOOTHING_WINDOW 50
#define STATE_CHANGE_DELAY 300

EMGFilters myFilter;
const SAMPLE_FREQUENCY sampleRate = SAMPLE_FREQ_1000HZ;
const NOTCH_FREQUENCY humFreq = NOTCH_FREQ_50HZ;

struct CalibrationData {
  float restLevel;
  float activeLevel;
  float upperThreshold;
  float lowerThreshold;
} calibData = { 0 };

float smoothingBuffer[SMOOTHING_WINDOW] = { 0 };
uint8_t smoothingIndex = 0;
float smoothingSum = 0;
bool bufferFilled = false;

enum FistState {
  FISTOPEN,
  FISTCLOSED,
  SPECIAL_GESTURE
} fistState = FISTOPEN;

enum SignalState {
  BELOW_THRESHOLD,
  ABOVE_THRESHOLD
} signalState = BELOW_THRESHOLD;

const unsigned long GESTURE_WINDOW = 1000;
unsigned long lastFlexTime = 0;
unsigned long lastStateChangeTime = 0;
uint8_t flexCount = 0;

volatile bool newData = false;
volatile int sensorValue = 0;

Ticker timerTicker;

void onTick() {
  newData = true;
}

void updateMotorState(float smoothedEnvelope) {
  unsigned long currentTime = millis();

  if (currentTime - lastStateChangeTime >= STATE_CHANGE_DELAY) {

    if (signalState == BELOW_THRESHOLD && smoothedEnvelope >= calibData.upperThreshold) {
      signalState = ABOVE_THRESHOLD;

      if (currentTime - lastFlexTime <= GESTURE_WINDOW) {
        flexCount++;
        if (flexCount == 2) {
          // Execute special gesture
          fistState = SPECIAL_GESTURE;
          // executeSpecialGesture();
          flexCount = 0;
        }
      } else {
        flexCount = 1;

        if (fistState != SPECIAL_GESTURE) {
          if (fistState == FISTOPEN) {
            fistState = FISTCLOSED;
            moveServos(servoArrAll, 180);
            digitalWrite(LED_PIN, HIGH);
          } else {
            fistState = FISTOPEN;
            moveServos(servoArrAll, 0);
            digitalWrite(LED_PIN, LOW);
          }
        }
      }

      lastFlexTime = currentTime;
      lastStateChangeTime = currentTime;
    }
    // Reset signal state when it falls below lower threshold
    else if (signalState == ABOVE_THRESHOLD && smoothedEnvelope <= calibData.lowerThreshold) {
      signalState = BELOW_THRESHOLD;
      lastStateChangeTime = currentTime;

      // If we're in special gesture state, return to open state
      if (fistState == SPECIAL_GESTURE) {
        fistState = FISTOPEN;
        moveServos(servoArrAll, 0);
        digitalWrite(LED_PIN, LOW);
      }
    }

    if (currentTime - lastFlexTime > GESTURE_WINDOW) {
      flexCount = 0;
    }
  }
}

void calibrateEMG() {
  float restSum = 0, activeSum = 0;
  unsigned int restCount = 0, activeCount = 0;
  const unsigned long halfCalibTime = CALIBRATION_TIME / 2;

  memset(smoothingBuffer, 0, sizeof(smoothingBuffer));
  smoothingSum = 0;
  smoothingIndex = 0;
  bufferFilled = false;

  Serial.println(F("Keep your hand relaxed for calibration..."));
  unsigned long startTime = millis();

  while (millis() - startTime < halfCalibTime) {
    if (newData) {
      newData = false;
      int value = analogRead(SENSOR_PIN);
      float filtered = myFilter.update(value);
      float envelope = abs(filtered);

      smoothingSum -= smoothingBuffer[smoothingIndex];
      smoothingBuffer[smoothingIndex] = envelope;
      smoothingSum += envelope;
      smoothingIndex = (smoothingIndex + 1) % SMOOTHING_WINDOW;

      if (smoothingIndex == 0) {
        bufferFilled = true;
        float smoothed = smoothingSum / SMOOTHING_WINDOW;
        restSum += smoothed;
        restCount++;
      }
    }
    yield();
  }

  // Phase 2: Active calibration
  Serial.println(F("Now flex your muscle for calibration..."));
  startTime = millis();

  while (millis() - startTime < halfCalibTime) {
    if (newData) {
      newData = false;
      int value = analogRead(SENSOR_PIN);
      float filtered = myFilter.update(value);
      float envelope = abs(filtered);

      smoothingSum -= smoothingBuffer[smoothingIndex];
      smoothingBuffer[smoothingIndex] = envelope;
      smoothingSum += envelope;
      smoothingIndex = (smoothingIndex + 1) % SMOOTHING_WINDOW;

      if (smoothingIndex == 0) {
        bufferFilled = true;
        float smoothed = smoothingSum / SMOOTHING_WINDOW;
        activeSum += smoothed;
        activeCount++;
      }
    }
    yield();
  }

  calibData.restLevel = restCount > 0 ? restSum / restCount : 0;
  calibData.activeLevel = activeCount > 0 ? activeSum / activeCount : 0;

  float range = calibData.activeLevel - calibData.restLevel;
  calibData.upperThreshold = calibData.restLevel + (range * 0.6);
  calibData.lowerThreshold = calibData.restLevel + (range * 0.4);

  memset(smoothingBuffer, 0, sizeof(smoothingBuffer));
  smoothingSum = 0;
  smoothingIndex = 0;
  bufferFilled = false;

  Serial.println(F("\nCalibration Results:"));
  Serial.printf("Rest Level: %.2f\n", calibData.restLevel);
  Serial.printf("Active Level: %.2f\n", calibData.activeLevel);
  Serial.printf("Upper Threshold: %.2f\n", calibData.upperThreshold);
  Serial.printf("Lower Threshold: %.2f\n", calibData.lowerThreshold);
}

void setupEMG() {
  // Initialize EMG

  myFilter.init(sampleRate, humFreq, true, true, true);
  timerTicker.attach_ms(1, onTick);
  delay(1000);
  calibrateEMG();
}

void setup() {
  Serial.begin(115200);
  delay(100);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // setupEMG();
  setupServer();
  setupMotor();
}

void loop() {
  // if (newData) {
  //   newData = false;

  //   sensorValue = analogRead(SENSOR_PIN);
  //   float filteredData = myFilter.update(sensorValue);
  //   float envelope = abs(filteredData);

  //   smoothingSum -= smoothingBuffer[smoothingIndex];
  //   smoothingBuffer[smoothingIndex] = envelope;
  //   smoothingSum += envelope;
  //   smoothingIndex = (smoothingIndex + 1) % SMOOTHING_WINDOW;

  //   float smoothedEnvelope = bufferFilled ? smoothingSum / SMOOTHING_WINDOW : smoothingSum / (smoothingIndex + 1);

  //   if (smoothingIndex == 0) bufferFilled = true;

  //   updateMotorState(smoothedEnvelope);

  //   Serial.printf("%.2f,%.2f,%.2f\n",
  //                 smoothedEnvelope,
  //                 calibData.upperThreshold, 
  //                 calibData.lowerThreshold);
  // }

  ws.cleanupClients();
  yield();
} 