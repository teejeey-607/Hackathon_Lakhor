// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
// import * as Location from 'expo-location';

// const LocationDisabledPage = ({ onEnableLocation }) => {
//   const navigation = useNavigation(); // Initialize navigation hook
//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === 'granted') {
//         const initialLocation = await Location.getCurrentPositionAsync({
//           accuracy: Location.Accuracy.High,
//         });
      
//         setRefreshing(false); // Stop refreshing
//         navigation.navigate('PassengerHome'); // Navigate back to PassengerHome screen
//       } else {
//         setRefreshing(false); // Stop refreshing if permission not granted
//       }
//     } catch (error) {
//       console.error('Error checking location permission:', error);
//       setRefreshing(false); // Stop refreshing in case of error
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//     >
//       <Text style={styles.message}>
//         Location is Disabled, Please enable the location and pull down to reload the app!
//       </Text>
    
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   message: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   link: {
//     marginTop: 10,
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
// });

// export default LocationDisabledPage;


import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from expo vector icons
import * as Location from 'expo-location';

const LocationDisabledPage = ({ onEnableLocation }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setRefreshing(false);
        navigation.navigate('PassengerHome');
      } else {
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.message}>
        Location is Disabled, Please enable the location and pull down to reload the app!
      </Text>
      
      {/* Button for refreshing */}
      <Pressable onPress={onRefresh} style={styles.refreshButton}>
        <Ionicons name="refresh" size={24} color="black" />
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
  },
});

export default LocationDisabledPage;


