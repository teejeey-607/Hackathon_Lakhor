import React from 'react';
import { StyleSheet, Text, View,Alert, TouchableOpacity,StatusBar,Pressable,ScrollView,Modal,TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo and have installed the Ionicons library
import { useState,useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';

let index = 1;
const pickUpPoints = [
    {
      id: "1",
      text: "Clock Tower, Tower Cafe",
    },
    {
      id: "2",
      text: "Clock Tower, Behind ZamZam Restaurant",
    },
    {
      id: "3",
      text: "Clock Tower Squaree",
    },
    {
      id: "4",
      text: "Clock Tower - Burger Point",
    },
    {
      id: "5",
      text: "Clock Tower, Tower Cafe",
    },
  ];

export default function LocalPickUp({ navigation,route }) {
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');
    const { currentLocation, pickupPoint, destination } = route.params;
    const GOOGLE_MAPS_API_KEY = 'AIzaSyAO-yhc-jkEdIiPLYN5y74ok88EhBrQRVc';
    const [pickupAddress, setPickupAddress] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');


    
  useEffect(() => {
    const fetchAddresses = async () => {
      if (pickupPoint && pickupPoint.latitude && pickupPoint.longitude) {
        try {
          const pickupResponse = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pickupPoint.latitude}&lon=${pickupPoint.longitude}`
          );

          const pickupAddress = pickupResponse.data.display_name.split(',')[0];
          setPickupAddress(pickupAddress);
          
        } catch (error) {
          console.error('Error fetching pickup address:', error);
        }
      } else {
        console.warn('Invalid pickup point:', pickupPoint);
      }

      if (destination && typeof destination.latitude === 'number' && typeof destination.longitude === 'number') {
        try {
          const destinationResponse = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${destination.latitude}&lon=${destination.longitude}`
          );
          const destinationAddress = destinationResponse.data.display_name.split(',')[0]; // Extract only the first part of the address
        setDestinationAddress(destinationAddress);

          // setDestinationAddress(destinationResponse.data.display_name);
        } catch (error) {
          console.error('Error fetching destination address:', error);
        }
      } else {
        console.warn('Invalid destination:', destination);
      }
    };

    fetchAddresses();
  }, [pickupPoint, destination]);

      // onPress Button
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleSubmitPressIn = () => {
    setSubmitPressed(true);
  };

  const handleSubmitPressOut = () => {
    setSubmitPressed(false);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  console.log(selectedItem)

  const [modalVisible, setModalVisible] = useState(false);
  
return (
    <View style={styles.container}>
    <View style={{justifyContent: 'center',alignItems: 'center',height:'55%',backgroundColor:'#D9D9D9'}}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#969696" />
        </TouchableOpacity>
        <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude || 0,
          longitude: currentLocation.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {pickupPoint && pickupPoint.latitude && pickupPoint.longitude && (
          <Marker
            coordinate={{
              latitude: pickupPoint.latitude,
              longitude: pickupPoint.longitude,
            }}
            pinColor='blue'
          >
            <View style={styles.marker}>
              <FontAwesome name="map-marker" size={40} color="blue" />
            </View>
            <Callout style={styles.callout}>
              <Text style={styles.calloutText}>{`Pickup Point: ${pickupAddress}`}</Text>
            </Callout>
          </Marker>
        )}

        {destination && destination.latitude && destination.longitude && (
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            pinColor='green'
          >
            <View style={styles.marker}>
              <FontAwesome name="map-marker" size={40} color="red" />
            </View>
            <Callout style={styles.callout}>
              <Text style={styles.calloutText}>{`Destination: ${destinationAddress}`}</Text>
            </Callout>
          </Marker>
        )}

        {pickupPoint && destination && (
          <MapViewDirections
            origin={pickupPoint}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={7}
            strokeColor="green"
          />
        )}
      </MapView>
      </View>

    <View >
        <TouchableOpacity style={{flexDirection:'row',paddingHorizontal:"7%",marginTop:'5%'}} onPress={() => setModalVisible(true)}>
        <View>
            <Ionicons name="create-outline" size={24} color="#4A4A4A" />
        </View>
        <View style={{justifyContent:'center',paddingLeft:'1%'}} >
            <Text style={{fontSize:12}}>Add Pick Up Note</Text>
        </View>
        </TouchableOpacity>
        {/* pickup note modal */}
        <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add a pick up point note</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter description of place where you are ..."
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top" 
            />
            <Pressable
              style={{backgroundColor:'#FF6B00',width:100,paddingVertical:'3%',alignItems:'center'}}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{color:'white',fontSize:12,fontWeight:500}}>ADD</Text>
              </Pressable>
          </View>
        </View>
      </Modal>

       
        <Text style={{paddingHorizontal:"7%",marginTop:'5%',fontSize:12,fontWeight:500}}>Common pick Up points</Text>
        <View style={{height:160,marginTop:'1%'}}>
        <ScrollView>
      {pickUpPoints.map((item, index) => (
        <Pressable
          key={item.id}
          onPress={() => setSelectedItem(item)}
          style={{
            backgroundColor: selectedItem === item ? "rgba(255, 107, 0,0.5)" : index % 2 === 0 ? "#D9D9D9" : "rgba(217, 217, 217,0.5)",
            marginTop: "0.5%",
          }}
        >
          <View style={{ paddingHorizontal: "10%", paddingVertical: 11.4 }}>
            <View style={{ paddingHorizontal: "10%" }}>
              <Text style={{ fontSize: 11, fontWeight: 400 }}>{item.text}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
        </View>
        <View style={{alignItems:'center', marginTop: "5%",paddingHorizontal:"10%" }}>

        <Pressable
            style={{
                ...styles.btn,
                backgroundColor: '#FF6B00',
                transform: [{ scale: submitPressed ? 0.98 : 1 }],
            }}
            onPress={() => navigation.navigate('chooseDriver')}
            onPressIn={handleSubmitPressIn}
            onPressOut={handleSubmitPressOut}
            >
        <Text style={{ color: 'white', fontSize: 12 }}>Choose This Pick-Up</Text>
        </Pressable>
        </View>
    </View>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor:'white'

    },
    button: {
    position: 'absolute',
    top: '12%',
    left: '5%',
    zIndex: 10, // To ensure it appears above other content
    padding: 5,
    borderRadius: 50,
    backgroundColor:'white'
},
    buttonText: {
    color: '#969696',
    fontSize: 16,
},
btn: {
    width: "70%",
    alignItems: 'center',
    paddingVertical: "4%"

  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width:'85%'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width:'100%',
    textAlign:'left',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100, // Minimum height for multiline input
    fontSize:12
  },
});
