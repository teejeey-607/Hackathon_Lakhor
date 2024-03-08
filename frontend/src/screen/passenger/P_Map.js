
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      getCurrentLocation();
    } else {
      showLocationPermissionAlert();
    }
  };

  const showLocationPermissionAlert = () => {
    Alert.alert(
      'Location Permission Required',
      'Please enable location services to use this feature.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Enable',
          onPress: () => {
            // Open app settings to allow the user to manually enable location services
            Linking.openSettings();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = coords;
      setCurrentLocation({ latitude, longitude });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDestinationSubmit = async () => {
    // Ensure that the user has provided a destination
    if (!destination) {
      Alert.alert('Error', 'Please enter a destination.');
      return;
    }

    try {
      // Example using Nominatim (replace with actual implementation):
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setDestinationCoords({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        setMapVisible(true); // Set mapVisible to true after submitting the destination
      } else {
        console.log('Destination not found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {mapVisible && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: currentLocation?.latitude || 0,
            longitude: currentLocation?.longitude || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Current Location"
              pinColor="green"
            />
          )}

          {destinationCoords && (
            <Marker
              coordinate={{
                latitude: destinationCoords.latitude,
                longitude: destinationCoords.longitude,
              }}
              title="Destination"
              pinColor="blue"
            />
          )}
        </MapView>
      )}

      {mapVisible ? (
        <View style={{ padding: 16, marginTop: 30 }}>
          {/* Displayed when the map is visible */}
        </View>
      ) : (
        <View style={{ padding: 16, marginTop: 30 }}>
          {/* Displayed when the map is not visible */}
          <Text>Current Location: {currentLocation ? `${currentLocation.latitude}, ${currentLocation.longitude}` : 'Loading...'}</Text>
          <TextInput
            placeholder="Enter Destination"
            value={destination}
            onChangeText={text => setDestination(text)}
            style={{ marginVertical: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          />
          <Button title="Submit Destination" onPress={handleDestinationSubmit} />
        </View>
      )}
    </View>
  );
};

export default Map;

