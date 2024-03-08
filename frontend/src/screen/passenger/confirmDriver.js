import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Pressable, ScrollView, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../../../config';
import ConfirmDriverSuccess from './successCD.js';

import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';



const GOOGLE_MAPS_API_KEY = 'AIzaSyAO-yhc-jkEdIiPLYN5y74ok88EhBrQRVc';

export default function ConfirmDriver({ navigation, route }) {
  StatusBar.setBackgroundColor('transparent');
  StatusBar.setBarStyle('dark-content');
  const { driver } = route.params;
  const [driverdetail, setDriverdetail] = useState([]);
  const [pickupAddress, setPickupAddress] = useState('');

  const { currentLocation } = route.params;


 


  // onPress Button
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleSubmitPressIn = () => {
    setSubmitPressed(true);
  };

  const handleSubmitPressOut = () => {
    setSubmitPressed(false);
  };

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        navigation.navigate('cancelOption');
      }, 5000); // 5 seconds in milliseconds

      // Clear the timer if the component is unmounted before 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showAlert, navigation]);


  
  useEffect(() => {
    const fetchAddresses = async () => {
      if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
        try {
          const pickupResponse = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${currentLocation.latitude}&lon=${currentLocation.longitude}`
          );

          const pickupAddress = pickupResponse.data.display_name.split(',')[0];
          setPickupAddress(pickupAddress);

        } catch (error) {
          console.error('Error fetching pickup address:', error);
        }
      } else {
        console.warn('Invalid pickup point:', currentLocation);
      }
    };

    fetchAddresses();
  }, [currentLocation]);

  useEffect(() => {
    const fetchDriverLocations = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/driverlocations`);
        const filteredData = response.data.filter(driverData => driverData.driver_id === driver.driver_id);
        setDriverdetail(filteredData);
      } catch (error) {
        console.error('Error fetching driver locations:', error);
      }
    };
  
    const intervalId = setInterval(fetchDriverLocations, 2000); // Fetch every 2 seconds
  
    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, [driver]); // Trigger the effect whenever the driver changes

  return (
    <>
    <View style={styles.container}>
    <Text style={styles.heading}>Map Page</Text>
    
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: currentLocation.latitude || 0,
        longitude: currentLocation.longitude || 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {/* Render the current location marker */}
      {currentLocation && (
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
        >
          <Ionicons name="md-person" size={30} color="red" />
        </Marker>
      )}

      {/* Render driver markers */}
      {driverdetail.map((driver) => (
        <Marker
          key={driver.driver_id}
          coordinate={{
            latitude: parseFloat(driver.latitude),
            longitude: parseFloat(driver.longitude),
          }}
        >
          <Ionicons name="car" size={24} color="#4A4A4A" />
        </Marker>
      ))}

      {/* Render directions if both current location and driver detail are available */}
      {currentLocation.latitude !== 0 && driverdetail.length > 0 && (
        <MapViewDirections
          origin={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}
          destination={{
            latitude: parseFloat(driverdetail[0].latitude),
            longitude: parseFloat(driverdetail[0].longitude),
          }}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={7}
          strokeColor="green"
        />
      )}
    </MapView>
     
    </View>
   

      <View>
        <View style={{ backgroundColor: '#FF6B00', paddingHorizontal: '8%', paddingVertical: '2%', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 500,fontFamily:'Roboto' }}>You've got driver!</Text>
            </View>
            <Ionicons name="trophy-outline" size={18} color="#ffff" style={{ paddingLeft: 5 }} />
          </View>
        </View>
        <View>
          <View style={{ flexDirection: 'row', paddingHorizontal: '8%', paddingVertical: '5%' }}>
            <View style={{ width: '50%' }}>
              <Image style={styles.profile} source={require('../../../assets/image/deleteItLater.jpg')} />
              <Text style={{ fontWeight: 500, fontSize: 12 }}>{driver?.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="star" size={12} color="black" style={{ padding: 1 }} />
                <Ionicons name="star" size={12} color="black" style={{ padding: 1 }} />
                <Ionicons name="star" size={12} color="black" style={{ padding: 1 }} />
                <Ionicons name="star" size={12} color="black" style={{ padding: 1 }} />
                <Ionicons name="star-half" size={12} color="black" style={{ padding: 1 }} />
              </View>
            </View>
            <View style={{ justifyContent: 'center', width: '40%' }}>
              <Image style={{ width: 55, height: 30, resizeMode: 'contain' }} source={require('../../../assets/image/car.png')} />
              <Text style={{ fontSize: 14, fontWeight: 500 }}>BP{driver?.vehiclenumber}</Text>
              <Text style={{ fontSize: 10 }}>{driver?.vehiclebrand}-{driver?.vehiclecolor}</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
              <Pressable
                onPress={() => {
                  // Handle the call press action here
                  const phoneNumber = '17123456'; // Replace with your phone number
                  Linking.openURL(`tel:${driver?.mobilenumber}`);
                }}
                style={({ pressed }) => ({
                  padding: 3,
                  borderWidth: 1,
                  borderColor: '#969696',
                  backgroundColor: pressed ? '#D1D1D1' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ scale: pressed ? 0.95 : 1 }]
                })}
              >
                <Ionicons name="call-outline" size={20} color="black" />
              </Pressable>

              <View style={{ paddingVertical: '10%' }}></View>

              <Pressable
                onPress={() => {
                  // Handle the WhatsApp press action here
                  const phoneNumber = '17123456'; // Replace with your phone number
                  Linking.openURL(`whatsapp://send?phone=${driver?.mobilenumber}`);
                }}
                style={({ pressed }) => ({
                  padding: 3,
                  borderWidth: 1,
                  borderColor: '#969696',
                  backgroundColor: pressed ? '#D1D1D1' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ scale: pressed ? 0.95 : 1 }]
                })}
              >
                <Ionicons name="logo-whatsapp" size={20} color="black" />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'center',paddingTop:'10%',paddingBottom:'10%', paddingHorizontal: "8%", flexDirection: 'row' }}>
          <Pressable
            style={{
              ...styles.btn,
              backgroundColor: '#2D2D2D',
              marginRight: '4%',
              transform: [{ scale: submitPressed ? 0.98 : 1 }],
            }}
            onPress={() => navigation.goBack()}
            onPressIn={handleSubmitPressIn}
            onPressOut={handleSubmitPressOut}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Cancel</Text>
          </Pressable>
          <Pressable
            style={{
              ...styles.btn,
              backgroundColor: '#FF6B00',
              marginLeft: '4%',
              transform: [{ scale: submitPressed ? 0.98 : 1 }],
            }}
            onPress={() => setShowAlert(true)}
            onPressIn={handleSubmitPressIn}
            onPressOut={handleSubmitPressOut}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Confirm Driver</Text>
          </Pressable>
        </View>
      </View>
      <ConfirmDriverSuccess
        visible={showAlert}
        message="You have completed the transaction"
        navigation={navigation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'

  },
  button: {
    position: 'absolute',
    top: '12%',
    left: '5%',
    zIndex: 10, // To ensure it appears above other content
    padding: 5,
    borderRadius: 50,
    backgroundColor: 'white'
  },
  buttonText: {
    color: '#969696',
    fontSize: 16,
  },
  btn: {
    width: "46%",
    alignItems: 'center',
    paddingVertical: "4%"

  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 100,

  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});
