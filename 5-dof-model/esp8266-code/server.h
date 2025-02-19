#include <ESP8266WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include "secrets.h"
#include "motors.h"

const int serverPort = 81;
AsyncWebServer server(serverPort);
AsyncWebSocket ws("/ws");

int connectedClients = 0;

IPAddress staticIP(192,  168, 137, 21);
IPAddress gateway(192, 168, 137, 1);
IPAddress subnet(255, 255, 255, 0);

void updateLEDStatus() {
  if (connectedClients > 0) {
    digitalWrite(LED_BUILTIN, LOW);
  } else {
    digitalWrite(LED_BUILTIN, HIGH);
  }
}

void onWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo *)arg;
  if (info->final && info->opcode == WS_TEXT) {
    char *message = new char[len + 1];
    memcpy(message, data, len);   
    message[len] = '\0';

    Serial.printf("Received: %s\n", message);
    handleCommand(String(message));

    ws.textAll(message);

    delete[] message;
  }
}

void onWebSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
                      AwsEventType type, void *arg, uint8_t *data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      connectedClients++;
      updateLEDStatus();
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      break;
    case WS_EVT_DISCONNECT:
      connectedClients--;
      updateLEDStatus();
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      break;
    case WS_EVT_DATA:
      onWebSocketMessage(arg, data, len);
      break;
    case WS_EVT_ERROR:
      Serial.printf("WebSocket client #%u error(%u): %s\n", client->id(), *((uint16_t *)arg), (char *)data);
      break;
  }
}

void setupServer() {
  WiFi.mode(WIFI_STA);
  WiFi.config(staticIP, gateway, subnet);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.printf("Connected to WiFi with static IP: %s:%d\n", WiFi.localIP().toString().c_str(), serverPort);

  ws.onEvent(onWebSocketEvent);
  server.addHandler(&ws);

  server.begin();
  Serial.printf("WebSocket server started on port %d!\n", serverPort);
}