import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Text } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import MapComponent from './components/MapComponent';
import { checkProximity } from './utils/locationUtils';
import { getCoordinates } from './utils/geocodeUtils';

const App = () => {
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [alarmRadius, setAlarmRadius] = useState(500); // Alarm trigger radius (meters)
  const [destinationName, setDestinationName] = useState(''); // Destination name input

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      // Get initial location
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();

    const interval = setInterval(() => {
      checkIfArrived();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [currentLocation, destinationCoords]);

  const setAlarm = async () => {
    try {
      const coords = await getCoordinates(destinationName);
      setDestinationCoords(coords);
      Alert.alert('Alarm Set', `Alarm set for ${destinationName}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to find the location');
    }
  };

  const checkIfArrived = async () => {
    if (!currentLocation || !destinationCoords) return;

    let location = await Location.getCurrentPositionAsync({});
    const proximity = checkProximity(location.coords, destinationCoords, alarmRadius);
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (proximity) {
      triggerAlarm();
    }
  };

  const triggerAlarm = () => {
    Alert.alert("You've arrived at your destination!", "Alarm triggered!");
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Destination reached",
        body: `You have arrived at ${destinationName}`,
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter destination place name"
        value={destinationName}
        onChangeText={setDestinationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Alarm radius (meters)"
        keyboardType="numeric"
        value={alarmRadius.toString()}
        onChangeText={(value) => setAlarmRadius(Number(value))}
      />
      <Button title="Set Alarm" onPress={setAlarm} />
      
      <MapComponent currentLocation={currentLocation} destination={destinationCoords} />

      {destinationCoords && (
        <Text style={styles.text}>
          Alarm set for {destinationName} ({destinationCoords.latitude}, {destinationCoords.longitude})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
