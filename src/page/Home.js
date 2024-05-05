import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Paho from "paho-mqtt";

export const client = new Paho.Client("wss://io.adafruit.com:443/mqtt/", "1212");

client.connect({
    useSSL: true,
    userName: "hongphat03",
    password: "",
    onSuccess: onConnect,
    onFailure: (message) => {
      console.log("Failed to connect to Adafruit: ", message.errorMessage);
    },})
client.onConnectionLost = onConnectionLost;


function onConnect() {
  console.log("onConnect");
  client.subscribe("hongphat03/feeds/cambien1");
  client.subscribe("hongphat03/feeds/cambien2");
  

};

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0)
    console.log("onConnectionLost:"+responseObject.errorMessage);
};

const HomePage = () => {
    const navigation = useNavigation();
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);

  useEffect(() => {
        client.onMessageArrived = async (message) => {
            console.log("onMessageArrived:"+message.payloadString);
            if(message.topic == "hongphat03/feeds/cambien1"){
            console.log("1")   
                setTemperature(message.payloadString)           
            }
            else{
                console.log("2")
                setHumidity(message.payloadString)
            }
        }
      }, []);
    
    const renderData = () => {
        return (
            <View style={styles.dataContainer}>
                <Text style={styles.label}>Temperature:</Text>
                <Text style={styles.value}>{temperature != null ? temperature : "Loading..."} °C</Text>

                <Text style={styles.label}>Humidity:</Text>
                <Text style={styles.value}>{humidity != null ? humidity : "Loading..." } %</Text>
            </View>
        );
    };

    const handleControlPageNavigation = () => {
        navigation.navigate('ControlPage');
    };

    return (
        <View style={styles.container2}>

            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Dashboard</Text>
                </View>
                {renderData()}

                <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleControlPageNavigation} style={styles.button}>
                    <Text style={styles.buttonText}>Go to Control Page</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container2:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4F4F4',
        padding: 20,
        marginTop:20,
        marginBottom:20,
        borderRadius:30,
        width:'80%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',

    },
    titleContainer:{
        position: 'absolute',
        top: 20,
        width: '100%',
        alignItems: 'center',
    },

    dataContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        color: '#333333',
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#007BFF',
    },
  
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#007BFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


export default HomePage;
