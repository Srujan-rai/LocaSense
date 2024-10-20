// components/MapComponent.js
import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

const MapComponent = ({ currentLocation, destination }) => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: currentLocation?.latitude || 37.78825,
        longitude: currentLocation?.longitude || -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {currentLocation && (
        <Marker coordinate={currentLocation} title="Current Location" />
      )}
      {destination && (
        <Marker coordinate={destination} title="Destination" pinColor="red" />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2, // Adjust as needed
  },
});

export default MapComponent;
