#include <Servo.h>

#define INDEX_FINGER 1
#define MIDDLE_FINGER 3
#define RING_FINGER 15
#define PINKY_FINGER 13
#define THUMB_FINGER 12

Servo servo1, servo2, servo3, servo4, servo5;



Servo* servoArrAll[] = { &servo1, &servo2, &servo3, &servo4, &servo5, nullptr };
Servo* indexGesture[] = { &servo2, &servo3, &servo4, nullptr };
Servo* okayGesture[] = { &servo1, &servo5, nullptr };
Servo* thumbsUpGesture[] = { &servo1, &servo2, &servo3, &servo4, nullptr };
Servo* victoryGesture[] = { &servo3, &servo4, &servo5, nullptr };
Servo* hawwww[] = { &servo1, &servo3, &servo4, &servo5, nullptr };  

void moveServos(Servo** servos, int angle, int delayMs = 0) {
  for (int i = 0; servos[i] != nullptr; i++) {
    int adjustedAngle = (servos[i] == &servo3 || servos[i] == &servo4) ? (180 - angle) : angle;
    servos[i]->write(adjustedAngle);
  }
}

void waveGesture() {
  const int delayTime = 500;
  const int waveAngle = 180;

  for (int cycle = 0; cycle < 3; cycle++) {
    servo1.write(waveAngle);
    delay(delayTime);
    servo1.write(0);

    servo2.write(waveAngle);
    delay(delayTime);
    servo2.write(0);

    servo3.write(180 - waveAngle);
    delay(delayTime);
    servo3.write(180);

    servo4.write(180 - waveAngle);
    delay(delayTime);
    servo4.write(180);

    servo5.write(waveAngle);
    delay(delayTime);
    servo5.write(0);
  }
}

void handleMediapipe(const String& command) {
  if (command.length() != 5) {
    Serial.println("Invalid MediaPipe command length");
    return;
  }

  // Thumb - servo5
  if (command[0] == '1') {
    servo5.write(180);
  } else {
    servo5.write(0);
  }

  // Index - servo1
  if (command[1] == '1') {
    servo1.write(180);
  } else {
    servo1.write(0);
  }

  // Middle - servo2
  if (command[2] == '1') {
    servo2.write(180);
  } else {
    servo2.write(0);
  }

  // Ring - servo3 (inverted)
  if (command[3] == '1') {
    servo3.write(0);  // inverted: 180 -> 0
  } else {
    servo3.write(180);  // inverted: 0 -> 180
  }

  // Pinky - servo4 (inverted)
  if (command[4] == '1') {
    servo4.write(0);  // inverted: 180 -> 0
  } else {
    servo4.write(180);  // inverted: 0 -> 180
  }

  Serial.print("Finger states: ");
  Serial.println(command);
}


void handleSpeed(const String& command) {
  int angle = command.substring(1).toInt();

  Serial.print("Received angle: ");
  Serial.println(angle);

  if (command[0] == '1') {
    servo1.write(angle);
  } else if (command[0] == '2') {
    servo2.write(angle);
  } else if (command[0] == '3') {
    servo3.write(180 - angle);
  } else if (command[0] == '4') {
    servo4.write(180 - angle);
  } else if (command[0] == '5') {
    servo5.write(angle);
  }
}

void handleCommand(const String& command) {
  Serial.println("Command Length" + String(command.length()));
  
  if (command.length() == 5 && command[0] == '1' || command[0] == '0' ) {
    Serial.println("Mediapipe command received: Handling State");
    handleMediapipe(command);
  } else if (command[0] == 'S') {
    Serial.println("Command S received: Handling Speed");
    handleSpeed(command.substring(1));
  } else {
    moveServos(servoArrAll, 0);

    if (command == "V") {
      Serial.println("Command V received: Perform Victory gesture");
      moveServos(victoryGesture, 180);
    } else if (command == "T") {
      Serial.println("Command T received: Perform Thumbs Up gesture");
      moveServos(thumbsUpGesture, 180);
    } else if (command == "O") {
      Serial.println("Command O received: Perform Okay gesture");
      moveServos(okayGesture, 180);
    } else if (command == "I") {
      Serial.println("Command I received: Perform Index gesture");
      moveServos(indexGesture, 180);
    } else if (command == "C") {
      Serial.println("Command C received: Perform Closing gesture");
      moveServos(servoArrAll, 180);
    } else if (command == "M") {
      Serial.println("Command M received: Perform Ganda gesture");
      moveServos(hawwww, 180);
    } else if (command == "R") {
      Serial.println("Command R received: Perform Rest gesture");
      moveServos(servoArrAll, 0);
    } else if (command == "W") {
      Serial.println("Command R received: Perform Wave gesture");
      waveGesture();
    } else {
      Serial.println("Unknown command received.");
      moveServos(servoArrAll, 0);
    }
  }
}

void setupMotor() {
  servo1.attach(INDEX_FINGER, 500, 2500);
  servo2.attach(MIDDLE_FINGER, 500, 2500);
  servo3.attach(RING_FINGER, 500, 2500);
  servo4.attach(PINKY_FINGER, 500, 2500);
  servo5.attach(THUMB_FINGER, 500, 2500);

  moveServos(servoArrAll, 0);
}