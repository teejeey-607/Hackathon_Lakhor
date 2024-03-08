import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import config from '../../../config';
import geolib from 'geolib';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAO-yhc-jkEdIiPLYN5y74ok88EhBrQRVc';
import car from '../../../assets/image/car1.png'

const ChooseDriver = ({ route, navigation }) => {
  const { currentLocation } = route.params;
  const [pickupAddress, setPickupAddress] = useState('');
  const [driverdetail, setDriverdetail] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null); // State to hold the selected driver

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
        const allDrivers = response.data;
  
        // Ensure that currentLocation is available
        if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
          console.warn('Invalid current location:', currentLocation);
          return;
        }
  
        // Calculate distances of all drivers from the current location
        allDrivers.forEach(driver => {
          const { latitude: driverLat, longitude: driverLng } = driver;
          const { latitude: currentLat, longitude: currentLng } = currentLocation;
          const distance = calculateDistance(driverLat, driverLng, currentLat, currentLng);
          driver.distance = distance;
        });
  
        // Sort drivers by distance and take the top 5 nearest ones
        const nearestDrivers = allDrivers
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);
  
        setDriverdetail(nearestDrivers);

        
      } catch (error) {
        console.error('Error fetching driver locations:', error);
      }
    };
  
    const intervalId = setInterval(fetchDriverLocations, 2000); // Fetch every 2 seconds
  
    return () => clearInterval(intervalId); // Cleanup
  }, []);
  
  // Function to calculate distance between two points using Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
  
  // Function to convert degrees to radians
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const handlePress = (driver) => {
    // Navigate to Confirmdriver page with driver data
    setSelectedDriver(driver);
    navigation.navigate('ConfirmDriver', { driver,currentLocation});
  };

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
          // showsUserLocation={true}
          // followsUserLocation={true} 
        >
          {driverdetail.map((driver) => (
            <Marker
              key={driver.driver_id}
              coordinate={{
                latitude: parseFloat(driver.latitude), // Assuming latitude is a string, convert to float
                longitude: parseFloat(driver.longitude), // Assuming longitude is a string, convert to float
              }}
            >
               <Image source={car} style={{ width: 30, height: 30 }} />
            </Marker>
          ))}
        </MapView>
      </View>

      <View>
        <View style={{ height: 198,backgroundColor:'white' }}>
          <View style={{paddingHorizontal:'10%',marginVertical:10}}>
            <Text style={{fontWeight:500,color:'#535353'}}>Available Taxi</Text>
          </View>
          <ScrollView bounces={false}>
            {driverdetail.map((driver) => (
              <TouchableOpacity key={driver.driver_id} onPress={() => handlePress(driver)} style={{backgroundColor:'#EAEAEA',marginVertical:1}}>
                <View
                  key={`driver_${driver.driver_id}`}
                  style={{
                    marginTop: "0.5%",
                    paddingHorizontal: "10%",
                    paddingVertical: 10.6
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '15%' }}>
                      <Ionicons name="car" size={24} color="#4A4A4A" />
                    </View>
                    <View style={{ justifyContent: 'center', width: '40%',alignItems:'center' }}>
                      <Text style={{ fontSize: 12, fontWeight: 500 }}>{driver.vehicletype}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', width: '40%',alignItems:'flex-end' }}>
                      <Text style={{ fontSize: 12, fontWeight: 500 }}>{driver.vehiclecapacity}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default ChooseDriver;
