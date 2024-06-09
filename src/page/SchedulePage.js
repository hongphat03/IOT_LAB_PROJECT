// src/SchedulePage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { client } from './Home';
import Paho from "paho-mqtt";
import { useNavigation } from '@react-navigation/native';

const SchedulePage = () => {
  const navigation = useNavigation();

  const [controller1, setController1] = useState();
  const [controller2, setController2] = useState();
  const [controller3, setController3] = useState();
  const [pump, setPump] = useState();

  const [cycle, setCycle] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShowPicker(false);
    setStartTime(currentDate);
  };

  const createSchedule = () => {
    let data = JSON.stringify({
      cycle: cycle,
      flow1: controller1,
      flow2: controller2,
      flow3: controller3,
      pumpIn: pump,
    })

     let message = new Paho.Message(data);
        message.destinationName = "hongphat03/feeds/iot-btl";
        message.qos = 0;

        client.send(message);

    navigation.navigate('HomePage');
    
  };

  return (
    <View style={styles.container2}>
      <View style={styles.container}>
      <Text style={styles.label}>Cycle:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cycle}
        onChangeText={setCycle}
      />

      <Text style={styles.label}>Mixer 1 (ml):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={controller1}
        onChangeText={setController1}
      />

      <Text style={styles.label}>Mixer 2 (ml):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={controller2}
        onChangeText={setController2}
      />

      <Text style={styles.label}>Mixer 3 (ml):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={controller3}
        onChangeText={setController3}
      />

     <Text style={styles.label}>Pump (ml):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={pump}
        onChangeText={setPump}
      />
      {/* <Text style={styles.label}>Start Time:</Text>
      <Button title={startTime.toLocaleTimeString()} onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )} */}

      {/* <Button title="Done Create" onPress={createSchedule} /> */}
       <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={createSchedule} style={styles.button}>
              <Text style={styles.buttonText}>Create</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width:"80%",
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
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

export default SchedulePage;
