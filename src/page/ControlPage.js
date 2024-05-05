import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Paho from "paho-mqtt";
import { client } from './Home';

const ControlPage = () => {
    const [lightOn, setLightOn] = useState(false);
    
    const handleLightControl = () => {
        const newLightState = !lightOn;
        setLightOn(newLightState);

        sendDataToAdafruit(newLightState);
    };

    const sendDataToAdafruit = (lightState) => {
        console.log(`Sending light state to Adafruit: ${lightState ? 'ON' : 'OFF'}`);
      
        var message = new Paho.Message(`${lightState ? '1' : '0'}`);
        message.destinationName = "hongphat03/feeds/nutnhan1";
        message.qos = 0;

        client.send(message);

    };

    return (
        <View style={styles.container2}>
            <View style={[styles.container, lightOn ? styles.lightOnBackground : styles.lightOffBackground]}>
                <Text style={styles.title}>Light is {lightOn?"ON":"OFF"}</Text>
                <TouchableOpacity onPress={handleLightControl} style={styles.button}>
                    <Text style={styles.buttonText}>{lightOn ? 'Turn Off Light' : 'Turn On Light'}</Text>
                </TouchableOpacity>
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
    button: {
        backgroundColor: '#007BFF',
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
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    lightOnBackground: {
        backgroundColor: '#F4F4F4', 
    },
    lightOffBackground: {
        backgroundColor: '#f4f4e8', 
    },
});

export default ControlPage;
