#define WLAN_SSID       "hp"
#define WLAN_PASS       "hongphat0303"

#define AIO_SERVER      "io.adafruit.com"
#define AIO_SERVERPORT  1883                   
#define AIO_USERNAME    "hongphat03"
#define AIO_KEY         "aio_pOsK84lMOtGyl0tKRA8LHa0bwjaK"


#include "DHTesp.h"
#include <ESP8266WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"

double humidity;
double temperature;

int waterPin = LED_BUILTIN;   
DHTesp dht;


WiFiClient client;
Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);

Adafruit_MQTT_Publish Temperature = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/cambien1");
Adafruit_MQTT_Publish Humidity = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/cambien2");
Adafruit_MQTT_Subscribe LED = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/nutnhan1");
void MQTT_connect();

void setup() {
  Serial.begin(9600);
  dht.setup(5, DHTesp::DHT11);
  pinMode(waterPin,OUTPUT); 

  Serial.println(); Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WLAN_SSID);

  WiFi.begin(WLAN_SSID, WLAN_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.println("WiFi connected");
  Serial.println("IP address: "); Serial.println(WiFi.localIP());

  mqtt.subscribe(&LED);
}

void loop() {
  humidity = dht.getHumidity();
  temperature = dht.getTemperature();
  Serial.print("humidity ");
  Serial.println(humidity);
  Serial.print("temperature ");
  Serial.println(temperature); 


  MQTT_connect();
 
  Adafruit_MQTT_Subscribe *subscription;
  while ((subscription = mqtt.readSubscription(5000))) {
    if (subscription == &LED) {
      Serial.print(F("Got: "));
      String ledstatus = (char *)LED.lastread;
      if (ledstatus == "0")
      {
        digitalWrite(waterPin, HIGH);
        Serial.println(ledstatus);
      }
      else if (ledstatus == "1")
      {
        digitalWrite(waterPin, LOW);
        Serial.println(ledstatus);
      }
    }
  }


  if (! Temperature.publish(temperature)) {
    Serial.println(F("Temperature Failed"));
  } else {
    Serial.println(F("Temperature OK!"));
  }
    if (! Humidity.publish(humidity)) {
    Serial.println(F("Humidity Failed"));
  } else {
    Serial.println(F("Humidity OK!"));
  }

  delay(3000);
}

void MQTT_connect() 
{
  int8_t ret;
  if (mqtt.connected()) 
  {
    return;
  }

  Serial.print("Connecting to MQTT... ");

  uint8_t retries = 3;
  while ((ret = mqtt.connect()) != 0) { // connect will return 0 for connected
       Serial.println(mqtt.connectErrorString(ret));
       Serial.println("Retrying MQTT connection in 5 seconds...");
       mqtt.disconnect();
       delay(5000);  // wait 5 seconds
       retries--;
       if (retries == 0) {
         // basically die and wait for WDT to reset me
         while (1);
       }
  }
  Serial.println("MQTT Connected!");
}