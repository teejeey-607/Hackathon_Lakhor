import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Text, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import config from '../../../config';
import * as SecureStore from 'expo-secure-store';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAO-yhc-jkEdIiPLYN5y74ok88EhBrQRVc';

export default function SelectLocal({ navigation, route }) {

  // const [localRoutes, setLocalRoutes] = useState([]);

  const [currentAddress, setCurrentAddress] = useState('');
  const [carLocation, setCarLocation] = useState(null);
  const { id,cid, name, pickupnote, destination, pessengercurrentlocation, time, numberofpassenger, type, drivercurrentLocation } = route.params;
  const [driverDetail, setDriverDetail] = useState([]);
  const[d_cid,setD_cid]=useState('');
  const[d_name,setD_name]=useState('');

  const handleConfirm = async () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to proceed?",
      [
        {
          text: "Yes",
          onPress: () => handleConfirmation(),
          style: "destructive",
        },
        {
          text: "No",
          onPress: () => handleCancel(),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch driver information from SecureStore
        const formDataString = await SecureStore.getItemAsync('formData');
        const formData = JSON.parse(formDataString);
        setD_cid(formData.cid);
        setD_name(formData.name);
        
        
      } catch (error) {
        console.error('Error fetching data from SecureStore', error);
      }
    };

    fetchData();
  }, []);


  const fare = 200;

  // Define the deleteItem function
  const deleteItem = async (itemId) => {
    try {
      // Call the backend API to delete the item
      await axios.delete(`${config.API_URL}/api/localroute/${itemId}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      // Handle error (e.g., show error message to user)
    }
  };


  const handleConfirmation = async (itemId) => {
    try {
      const response = await axios.post(`${config.API_URL}/api/RouteAccepted`, {
        d_cid,
        d_name,
        cid,
        name,
        pickupnote,
        destination,
        fare,
        drivercurrentLocation
      });

      await deleteItem(id);

      // setRefresh(true);
      navigation.navigate('driverHome', {
       
      });
    } catch (error) {
      console.error('Error submitting route:', error);
    }
  };
 

  const handleCancel = () => {
    // No action needed when canceled
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const locationObject = JSON.parse(pessengercurrentlocation);
        const { latitude, longitude } = locationObject;
        if (!isNaN(latitude) && !isNaN(longitude)) {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const address = response.data.display_name.split(',')[0];
          setCurrentAddress(address);
        } else {
          console.warn('Invalid latitude or longitude:', latitude, longitude);
        }
      } catch (error) {
        console.error('Error fetching current address:', error);
      }
    };
    fetchAddress();
  }, [pessengercurrentlocation]);
  console.log('wai',drivercurrentLocation)

  useEffect(() => {
    if (drivercurrentLocation) {
      setCarLocation(drivercurrentLocation); // Update car location when driver moves
    }
  }, [drivercurrentLocation]);


  useEffect(() => {
    const fetchDriverLocations = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/driverlocations`);
        setDriverDetail(response.data);
      } catch (error) {
        console.error('Error fetching driver locations:', error);
      }
    };

    const intervalId = setInterval(fetchDriverLocations, 2000); // Fetch every 2 seconds

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []); // No dependencies, so the effect runs only once when the component mounts


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: drivercurrentLocation ? drivercurrentLocation.latitude : 0,
          longitude: drivercurrentLocation ? drivercurrentLocation.longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* {drivercurrentLocation && (
          <Marker
            coordinate={{
              latitude: drivercurrentLocation.latitude,
              longitude: drivercurrentLocation.longitude,
            }}
          >
            <Ionicons name="md-car" size={30} color="blue" />
          </Marker>
        )} */}

        {pessengercurrentlocation && currentAddress && (
          <Marker
            coordinate={{
              latitude: JSON.parse(pessengercurrentlocation).latitude,
              longitude: JSON.parse(pessengercurrentlocation).longitude,
            }}
            pinColor="red"
            title={currentAddress}
          >
            <Ionicons name="md-person" size={30} color="red" />
          </Marker>
        )}

        {pessengercurrentlocation && drivercurrentLocation && (
          <MapViewDirections
            origin={drivercurrentLocation}
            destination={JSON.parse(pessengercurrentlocation)}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="green"
          />
        )}

      </MapView>



      <View >
        <View style={{ backgroundColor: '#EAEAEA',marginTop:1 }}>
          <View style={{ paddingHorizontal: "10%", paddingVertical: '3%' }}>
            <View>
              <Text style={{ fontSize: 12, fontWeight: 600 }}>CID: {cid}</Text>
              <Text style={{ fontSize: 12, fontWeight: 600 }}>Name: {name}</Text>
            </View>
            <View style={{ flexDirection: 'row',marginTop: '8%'  }}>
              <View style={{width:'40%'}}>
                <Text style={{ fontSize: 12, fontWeight: 600 }}>From:</Text>
                <Text style={{ fontSize: 11 }}>{pickupnote}</Text>

                <Text style={{ fontSize: 12, fontWeight: 600, marginTop: '5%' }}>To</Text>
                <Text style={{ fontSize: 11 }}>{destination}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', width: '60%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 600 }}>Nu.200</Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, fontWeight: 600, marginTop: '8%' }}>Additional Pick Up Note</Text>
            <Text style={{ fontSize: 11, textAlign: 'justify' }}>No of Passenger : {numberofpassenger}</Text>
            <Text style={{ fontSize: 11, textAlign: 'justify' }}>Pickup time : {time}</Text>
            <Text style={{ fontSize: 11, textAlign: 'justify' }}>Type : {type}</Text>

          </View>

        </View>
        <View style={{ flexDirection: "row", marginTop: "5%", marginBottom: "5%", paddingHorizontal: "10%" }}>
          <Pressable
            style={{
              ...styles.btn,
              backgroundColor: '#2E3E31',
              marginRight: '4%',
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Cancel</Text>
          </Pressable>
          <Pressable
            style={{
              ...styles.btn,
              backgroundColor: '#0F992E',
              marginLeft: '4%',
            }}
            onPress={handleConfirm}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  map: {
    flex: 1,
  },
  btn: {
    width: "46%",
    alignItems: 'center',
    paddingVertical: "4%",
  },
});



// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Button, Text, View, Pressable, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import config from '../../../config';
// import * as SecureStore from 'expo-secure-store';


// const GOOGLE_MAPS_API_KEY = 'AIzaSyAO-yhc-jkEdIiPLYN5y74ok88EhBrQRVc';

// export default function SelectLocal({ navigation, route }) {
//   const [currentAddress, setCurrentAddress] = useState('');
//   const [carLocation, setCarLocation] = useState(null);
//   const { cid, name, pickupnote, destination, pessengercurrentlocation, time, numberofpassenger, type, drivercurrentLocation } = route.params;
//   const [driverDetail, setDriverDetail] = useState([]);
//   const[d_cid,setD_cid]=useState('');
//   const[d_name,setD_name]=useState('');
//   const handleConfirm = async () => {
//     Alert.alert(
//       "Confirmation",
//       "Are you sure you want to proceed?",
//       [
//         {
//           text: "Yes",
//           onPress: () => handleConfirmation(),
//           style: "destructive",
//         },
//         {
//           text: "No",
//           onPress: () => handleCancel(),
//           style: "cancel",
//         },
//       ],
//       { cancelable: false }
//     );
//   };


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch driver information from SecureStore
//         const formDataString = await SecureStore.getItemAsync('formData');
//         const formData = JSON.parse(formDataString);
//         setD_cid(formData.cid);
//         setD_name(formData.name);
        
    
        
//       } catch (error) {
//         console.error('Error fetching data from SecureStore', error);
//       }
//     };

//     fetchData();
//   }, []);


//   const fare = 200;

//   const handleConfirmation = async () => {
//     try {
//       const response = await axios.post(`${config.API_URL}/api/RouteAccepted`, {
//         d_cid,
//         d_name,
//         cid,
//         name,
//         pickupnote,
//         destination,
//         fare,
//         drivercurrentLocation
//       });

//       navigation.navigate('payment', {
//         cid,
//         name,
//         pickupnote,
//         destination,
//         fare
//       });
//     } catch (error) {
//       console.error('Error submitting route:', error);
//     }
//   };
 

//   const handleCancel = () => {
//     // No action needed when canceled
//   };

//   useEffect(() => {
//     const fetchAddress = async () => {
//       try {
//         const locationObject = JSON.parse(pessengercurrentlocation);
//         const { latitude, longitude } = locationObject;
//         if (!isNaN(latitude) && !isNaN(longitude)) {
//           const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
//           const address = response.data.display_name.split(',')[0];
//           setCurrentAddress(address);
//         } else {
//           console.warn('Invalid latitude or longitude:', latitude, longitude);
//         }
//       } catch (error) {
//         console.error('Error fetching current address:', error);
//       }
//     };
//     fetchAddress();
//   }, [pessengercurrentlocation]);
//   console.log(drivercurrentLocation)

//   useEffect(() => {
//     if (drivercurrentLocation) {
//       setCarLocation(drivercurrentLocation); // Update car location when driver moves
//     }
//   }, [drivercurrentLocation]);


  

//   useEffect(() => {
//     const fetchDriverLocations = async () => {
//       try {
//         const response = await axios.get(`${config.API_URL}/api/driverlocations`);
//         setDriverDetail(response.data);
//       } catch (error) {
//         console.error('Error fetching driver locations:', error);
//       }
//     };

//     const intervalId = setInterval(fetchDriverLocations, 2000); // Fetch every 2 seconds

//     // Cleanup function to clear the interval
//     return () => clearInterval(intervalId);
//   }, []); // No dependencies, so the effect runs only once when the component mounts


//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         region={{
//           latitude: drivercurrentLocation ? drivercurrentLocation.latitude : 0,
//           longitude: drivercurrentLocation ? drivercurrentLocation.longitude : 0,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//         showsUserLocation={true}
//         followsUserLocation={true}
//       >
//         {/* {drivercurrentLocation && (
//           <Marker
//             coordinate={{
//               latitude: drivercurrentLocation.latitude,
//               longitude: drivercurrentLocation.longitude,
//             }}
//           >
//             <Ionicons name="md-car" size={30} color="blue" />
//           </Marker>
//         )} */}

//         {pessengercurrentlocation && currentAddress && (
//           <Marker
//             coordinate={{
//               latitude: JSON.parse(pessengercurrentlocation).latitude,
//               longitude: JSON.parse(pessengercurrentlocation).longitude,
//             }}
//             pinColor="red"
//             title={currentAddress}
//           >
//             <Ionicons name="md-person" size={30} color="red" />
//           </Marker>
//         )}

//         {pessengercurrentlocation && drivercurrentLocation && (
//           <MapViewDirections
//             origin={drivercurrentLocation}
//             destination={JSON.parse(pessengercurrentlocation)}
//             apikey={GOOGLE_MAPS_API_KEY}
//             strokeWidth={3}
//             strokeColor="green"
//           />
//         )}

//       </MapView>



//       <View style={{}}>
       
//         <View style={{ backgroundColor: '#D9D9D9' }}>
//           <View style={{ paddingHorizontal: "10%", paddingVertical: '3%' }}>
//             <View>
//               <Text style={{ fontSize: 12, fontWeight: 600 }}>CID: {cid}</Text>
//               <Text style={{ fontSize: 12, fontWeight: 600 }}>Name: {name}</Text>
//             </View>
//             <View style={{ flexDirection: 'row' }}>
//               <View>
//                 <Text style={{ fontSize: 12, fontWeight: 600 }}>From:</Text>
//                 <Text style={{ fontSize: 11 }}>{pickupnote}</Text>

//                 <Text style={{ fontSize: 12, fontWeight: 600, marginTop: '5%' }}>To</Text>
//                 <Text style={{ fontSize: 11 }}>{destination}</Text>
//               </View>
//               <View style={{ alignItems: 'flex-end', width: '60%', justifyContent: 'center' }}>
//                 <Text style={{ fontSize: 14, fontWeight: 600 }}>Nu.200</Text>
//               </View>
//             </View>
//             <Text style={{ fontSize: 12, fontWeight: 600, marginTop: '8%' }}>Additional Pick Up Note</Text>
//             <Text style={{ fontSize: 11, textAlign: 'justify' }}>No of Passenger : {numberofpassenger}</Text>
//             <Text style={{ fontSize: 11, textAlign: 'justify' }}>Pickup time : {time}</Text>
//             <Text style={{ fontSize: 11, textAlign: 'justify' }}>Type : {type}</Text>

//           </View>

//         </View>
//         <View style={{ flexDirection: "row", marginTop: "6%", paddingHorizontal: "10%" }}>
//           <Pressable
//             style={{
//               ...styles.btn,
//               backgroundColor: '#2E3E31',
//               marginRight: '4%',
//             }}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={{ color: 'white', fontSize: 12 }}>Cancel</Text>
//           </Pressable>
//           <Pressable
//             style={{
//               ...styles.btn,
//               backgroundColor: '#0F992E',
//               marginLeft: '4%',
//             }}
//             onPress={handleConfirm}
//           >
//             <Text style={{ color: 'white', fontSize: 12 }}>Confirm</Text>
//           </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   map: {
//     flex: 1,
//   },
//   btn: {
//     width: "46%",
//     alignItems: 'center',
//     paddingVertical: "4%",
//   },
// });


