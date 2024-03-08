

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, Alert, Linking } from 'react-native';
// import MapView, { Marker, Callout } from 'react-native-maps';
// import * as Location from 'expo-location';
// import axios from 'axios';
// import config from "../../../config";

// const Map = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [pickupPoint, setPickupPoint] = useState('');
//   const [destination, setDestination] = useState('');
//   const [destinationCoords, setDestinationCoords] = useState(null);
//   const [pickupPointCoords, setPickupPointCoords] = useState(null);
//   const [mapVisible, setMapVisible] = useState(false);
//   const [loadingReserved, setLoadingReserved] = useState(false);
//   const [loadingLocal, setLoadingLocal] = useState(false);
//   const [submittingType, setSubmittingType] = useState(null);
//   const [refreshButtons, setRefreshButtons] = useState(false); // State to trigger button refresh

//   useEffect(() => {
//     checkLocationPermission();
//   }, [refreshButtons]); // Add refreshButtons to the dependency array

//   const checkLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();

//     if (status === 'granted') {
//       getCurrentLocation();
//     } else {
//       showLocationPermissionAlert();
//     }
//   };

//   const showLocationPermissionAlert = () => {
//     Alert.alert(
//       'Location Permission Required',
//       'Please enable location services to use this feature.',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Enable',
//           onPress: () => {
//             Linking.openSettings();
//           },
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const { coords } = await Location.getCurrentPositionAsync();
//       const { latitude, longitude } = coords;
//       setCurrentLocation({ latitude, longitude });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDestinationSubmit = async (isReserved) => {
//     // Ensure that both pickup point and destination are provided
//     if (!pickupPoint || !destination) {
//       Alert.alert('Error', 'Please enter both pickup point and destination.', [
//         {
//           text: 'OK',
//           onPress: () => {
//             setRefreshButtons(prevState => !prevState);
//             setLoadingReserved(false);
//             setLoadingLocal(false);
//           },
//         },
//       ]);
//       // Clear input fields if either pickup or destination is empty
//       setPickupPoint('');
//       setDestination('');
//       return;
//     }

//     // Disable the other button while one is being submitted
//     setSubmittingType(isReserved ? 'reserved' : 'local');

//     try {
//       // Example using Nominatim for destination (replace with actual implementation):
//       const destinationResponse = await axios.get(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
//       );
//       const destinationData = destinationResponse.data;

//       // Example using Nominatim for pickup point (replace with actual implementation):
//       const pickupResponse = await axios.get(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${pickupPoint}`
//       );
//       const pickupData = pickupResponse.data;

//       if (destinationData.length > 0 && pickupData.length > 0) {
//         const destCoords = {
//           latitude: parseFloat(destinationData[0].lat),
//           longitude: parseFloat(destinationData[0].lon),
//         };
//         const pickupCoords = {
//           latitude: parseFloat(pickupData[0].lat),
//           longitude: parseFloat(pickupData[0].lon),
//         };

//         // Set state to update the UI
//         setDestinationCoords(destCoords);
//         setPickupPointCoords(pickupCoords);
//         setMapVisible(true);

//         // Send data to the server
//         await axios.post(`${config.API_URL}/api/map`, {
//           pickup: pickupPoint,
//           destination: destination,
//           type: isReserved ? 'reserved' : 'local',
//         });
//       } else {
//         Alert.alert('Location Not Found', 'Destination or Pickup Point not found.', [
//           {
//             text: 'OK',
//             onPress: () => setRefreshButtons(prevState => !prevState),
//           },
//         ]);
//         console.log('Destination or Pickup Point not found');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred. Please try again.', [
//         {
//           text: 'OK',
//           onPress: () => setRefreshButtons(prevState => !prevState),
//         },
//       ]);
//       console.error(error);
//     } finally {
//       // Reset the loading state based on the button clicked
//       if (isReserved) {
//         setLoadingReserved(false);
//       } else {
//         setLoadingLocal(false);
//       }

//       setSubmittingType(null); // Reset submittingType after submission is complete
//     }
//   };

//   const handleReservedSubmit = async () => {
//     setLoadingReserved(true);
//     handleDestinationSubmit(true);
//   };

//   const handleLocalSubmit = async () => {
//     setLoadingLocal(true);
//     handleDestinationSubmit(false);
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {mapVisible ? (
//         <MapView
//           style={{ flex: 1 }}
//           initialRegion={{
//             latitude: currentLocation?.latitude || 0,
//             longitude: currentLocation?.longitude || 0,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           }}
//         >
//           {pickupPointCoords && (
//             <Marker
//               coordinate={{
//                 latitude: pickupPointCoords.latitude,
//                 longitude: pickupPointCoords.longitude,
//               }}
//               pinColor="green"
//             >
//               <Callout>
//                 <Text>{`Pickup Point: ${pickupPoint}`}</Text>
//               </Callout>
//             </Marker>
//           )}

//           {destinationCoords && (
//             <Marker
//               coordinate={{
//                 latitude: destinationCoords.latitude,
//                 longitude: destinationCoords.longitude,
//               }}
//               title="Destination"
//               pinColor="blue"
//             />
//           )}
//         </MapView>
//       ) : null}

//       {pickupPointCoords && destinationCoords && !mapVisible && (
//         <View style={{ padding: 16, position: 'absolute', top: 0, left: 0, right: 0 }}>
//           <Text>Pickup Point: {`${pickupPointCoords.latitude}, ${pickupPointCoords.longitude}`}</Text>
//           <Text>Destination: {`${destinationCoords.latitude}, ${destinationCoords.longitude}`}</Text>
//         </View>
//       )}

//       {!mapVisible && currentLocation && (
//         <View style={{ padding: 16, marginTop: 30 }}>
//           <Text>Current Location: {currentLocation ? `${currentLocation.latitude}, ${currentLocation.longitude}` : 'Loading...'}</Text>
//           <TextInput
//             placeholder="Enter Pickup Point"
//             value={pickupPoint}
//             onChangeText={text => setPickupPoint(text)}
//             style={{ marginVertical: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
//           />
//           <TextInput
//             placeholder="Enter Destination"
//             value={destination}
//             onChangeText={text => setDestination(text)}
//             style={{ marginVertical: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
//           />
//           <Button
//             style={{
//               marginVertical: 8,
//             }}
//             title={loadingReserved ? 'Submitting Reserved...' : 'Submit Reserved'}
//             onPress={handleReservedSubmit}
//             disabled={loadingReserved}
//           />
//           <View style={{ marginVertical: 10 }}>
//             <Button
//               title={loadingLocal ? 'Submitting Local...' : 'Submit Local'}
//               onPress={handleLocalSubmit}
//               disabled={loadingLocal}
//             />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default Map;




import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Linking } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import config from '../../../config';
// Import icons from react-native-vector-icons
import { FontAwesome,MaterialIcons} from '@expo/vector-icons';


const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupPoint, setPickupPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [pickupPointCoords, setPickupPointCoords] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [loadingReserved, setLoadingReserved] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [submittingType, setSubmittingType] = useState(null);
  const [refreshButtons, setRefreshButtons] = useState(false); // State to trigger button refresh

  const [fare, setFare] = useState('');

  useEffect(() => {
    checkLocationPermission();
  }, [refreshButtons]); // Add refreshButtons to the dependency array

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

  const handleDestinationSubmit = async (isReserved) => {
    // Ensure that both pickup point and destination are provided
    if (!pickupPoint || !destination) {
      Alert.alert('Error', 'Please enter both pickup point and destination.', [
        {
          text: 'OK',
          onPress: () => {
            setRefreshButtons((prevState) => !prevState);
            setLoadingReserved(false);
            setLoadingLocal(false);
          },
        },
      ]);
      // Clear input fields if either pickup or destination is empty
      setPickupPoint('');
      setDestination('');
      return;
    }
  
    try {
      // Example using Nominatim for destination (replace with actual implementation):
      const destinationResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
      );
      const destinationData = destinationResponse.data;
      console.log(destinationData[0].name);

      // Example using Nominatim for pickup point (replace with actual implementation):
      const pickupResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${pickupPoint}`
      );
      const pickupData = pickupResponse.data;
      console.log(pickupData[0].name);

      //send the pickup and destination location names to the backend server to fetch the amount
      if (pickupData[0].name && destinationData[0].name) {//make axios connection
        const res = await axios.get(`${config.API_URL}/api/rideinfo`, {
          params: {
            pickup: pickupData[0].name,
            destination: destinationData[0].name,
          }
        });

        console.log(res.data.fare);
        setFare(res.data.fare);

      }

      if (destinationData.length > 0 && pickupData.length > 0) {
        const destCoords = {
          latitude: parseFloat(destinationData[0].lat),
          longitude: parseFloat(destinationData[0].lon),
        };
        const pickupCoords = {
          latitude: parseFloat(pickupData[0].lat),
          longitude: parseFloat(pickupData[0].lon),
        };

        // Set state to update the UI
        setDestinationCoords(destCoords);
        setPickupPointCoords(pickupCoords);
        setMapVisible(true);

        // Send data to the server
        await axios.post(`${config.API_URL}/api/map`, {
          pickup: pickupPoint,
          destination: destination,
          type: isReserved ? 'reserved' : 'local',
        });
      } else {
        Alert.alert('Location Not Found', 'Destination or Pickup Point not found.', [
          {
            text: 'OK',
            onPress: () => setRefreshButtons((prevState) => !prevState),
          },
        ]);
        console.log('Destination or Pickup Point not found');
      }
    } catch (error) {
      console.error('Axios Error:', error);
  
      // Display a more informative error message
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
  
      Alert.alert('Error', errorMessage, [
        {
          text: 'OK',
          onPress: () => setRefreshButtons((prevState) => !prevState),
        },
      ]);
    } finally {
      // Reset the loading state based on the button clicked
      if (isReserved) {
        setLoadingReserved(false);
      } else {
        setLoadingLocal(false);
      }
  
      setSubmittingType(null); // Reset submittingType after submission is complete
    }
  };
  

  const handleReservedSubmit = async () => {
    setLoadingReserved(true);
    handleDestinationSubmit(true);
  };

  const handleLocalSubmit = async () => {
    setLoadingLocal(true);
    handleDestinationSubmit(false);
  };
  console.log(destination)

  return (
    <View style={{ flex: 1 }}>
       <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
       <Text>pickup: {pickupPoint}</Text>
       <Text>destination: {destination}</Text>
       <Text>fare amount: {fare}</Text>
    </View>

      {mapVisible ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: currentLocation?.latitude || 0,
            longitude: currentLocation?.longitude || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {pickupPointCoords && (
            <Marker
              coordinate={{
                latitude: pickupPointCoords.latitude,
                longitude: pickupPointCoords.longitude,
              }}
            
            >
               <View style={{ alignItems: 'center' }}>
                <FontAwesome name="map-marker" size={40} color="green" />

              </View>
              <Callout style={{ width:200, height:50}}>
                <Text style={{fontSize:12}}>{`Pickup Point: ${pickupPoint}`}</Text>
              </Callout>
            </Marker>
          )}

          {destinationCoords && (
            <Marker
              coordinate={{
                latitude: destinationCoords.latitude,
                longitude: destinationCoords.longitude,
              }}
              
              
            >
               <View style={{ alignItems: 'center' }}>
                <FontAwesome name="map-marker" size={40} color="blue" />
              </View>
              <Callout style={{ width: 200, height: 50}}>
                <Text style={{fontSize:12}}>{`Destination:${destination}`}</Text>
              </Callout>
              
              
              </Marker>
              
              
            
          )}
          
        </MapView>
      ) : null}

      {pickupPointCoords && destinationCoords && !mapVisible && (
        <View style={{ padding: 16, position: 'absolute', top: 0, left: 0, right: 0 }}>
          <Text>Pickup Point: {`${pickupPointCoords.latitude}, ${pickupPointCoords.longitude}`}</Text>
          <Text>Destination: {`${destinationCoords.latitude}, ${destinationCoords.longitude}`}</Text>
        </View>
      )}

      {!mapVisible && currentLocation && (
        <View style={{ padding: 16, marginTop: 30 }}>
          <Text>Current Location: {currentLocation ? `${currentLocation.latitude}, ${currentLocation.longitude}` : 'Loading...'}</Text>
          <TextInput
            placeholder="Enter Pickup Point"
            value={pickupPoint}
            onChangeText={(text) => setPickupPoint(text)}
            style={{ marginVertical: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          />
          <TextInput
            placeholder="Enter Destination"
            value={destination}
            onChangeText={(text) => setDestination(text)}
            style={{ marginVertical: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          />
          <Button
            style={{
              marginVertical: 8,
            }}
            title={loadingReserved ? 'Submitting Reserved...' : 'Submit Reserved'}
            onPress={handleReservedSubmit}
            disabled={loadingReserved}
          />
          <View style={{ marginVertical: 10 }}>
            <Button
              title={loadingLocal ? 'Submitting Local...' : 'Submit Local'}
              onPress={handleLocalSubmit}
              disabled={loadingLocal}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Map;