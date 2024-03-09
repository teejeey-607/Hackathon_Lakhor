import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View,Alert,TouchableOpacity,StatusBar,Pressable,ScrollView,KeyboardAvoidingView ,TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import { Button } from 'react-native-paper';
import config from '../../../config';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';
const PassengerInput = ({ value, onChange }) => {
   const increment = () => {
   if (value < 6) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* <TouchableOpacity style={{backgroundColor:'#FF6B00',borderRadius:5,alignItems:'center',justifyContent:'center',
      paddingHorizontal:15,paddingVertical:8,marginRight:10}} onPress={decrement}>
        <Text style={{ fontSize: 20,color:'white',fontWeight:500 }}>-</Text>
      </TouchableOpacity> */}
      <TextInput
        style={{ height: 40, borderColor: '#D9D9D9',width:5, borderWidth: 1, flex: 1 ,borderRadius:5,paddingHorizontal:10}}
        keyboardType="numeric"
        placeholder='Enter no. of passenger'
        value={value ? value.toString() : ''} // Ensure value is not undefined before calling toString()
        onChangeText={onChange}
      />
      {/* <TouchableOpacity onPress={increment} style={{backgroundColor:'#FF6B00',borderRadius:5,alignItems:'center',justifyContent:'center',
      paddingHorizontal:15,paddingVertical:8,marginLeft:10}}>
        <Text style={{ fontSize: 20,color:'white',fontWeight:500 }}>+</Text>
      </TouchableOpacity> */}
    </View>
  );
};



const MapPage = ({ route,navigation}) => {
  const { currentLocation, destination,type } = route.params;
  const [pickupAddress, setPickupAddress] = useState('');
  const[pickupnote,setPickupnote]=useState('')
  const[time,setTime]=useState('')
  const[numberofpassenger,setNumberofpassenger]=useState('');
  const [user, setUser] = useState(null);
  // const [date,setDate]=useState('');
  const [date, setDate] = useState(new Date())

  const [rideDate, setRideDate] = useState(new Date());
  const [rideTime, setRideTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || rideDate;
    setShowDatePicker(Platform.OS === 'ios');
    setRideDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || rideTime;
    setShowTimePicker(Platform.OS === 'ios');
    setRideTime(currentTime);
  };
  

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
    fetchUserData();
  }, [currentLocation]);

  const fetchUserData = async () => {
    try {
      const storedUserData = await SecureStore.getItemAsync('registeredData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
      } else {
        console.log('No user data found in SecureStore');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  



  
  const handleProcess = async () => {
    try {
      // Validate input values
      if (!time) {
        showAlert('Error', 'Please enter a time.');
      } else if (!numberofpassenger || isNaN(numberofpassenger) || parseInt(numberofpassenger) <= 0) {
        showAlert('Please enter number of passengers.');
      } else if(!pickupnote){
        showAlert('Please enter pickupnote.');

      }else{
        // Make a POST request to your API endpoint
        const response = await axios.post(`${config.API_URL}/api/map`, {
          name: user.name,
          cid: user.cid,
          mobilenumber: user.mobilenumber,
          pickupnote: pickupnote,
          time: time,
          date: date,
          numberofpassenger: numberofpassenger,
          destination: destination,
          currentLocation: currentLocation,
          type: type,
        });

        // Handle the response
        console.log(response.data);
       // Assuming the server returns some data upon successful insertion

        navigation.navigate('chooseDriver', { currentLocation: currentLocation });
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to process the request. Please try again.');
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  };


      

  return (
    <KeyboardAvoidingView style={{flex:1}}
    behavior={Platform.OS === "ios" ? "padding" : null}>
        <ScrollView contentContainerStyle={{flex:1}} bounces={false}>
    <View style={{flex:1}}>
    <View style={{position:'absolute',zIndex:2,top:35,left:10}}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="#969696" />
      </TouchableOpacity>
      
     </View>
  
    <View style={styles.container}>

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

        </MapView>
            
  
    </View>
    <View style={{alignItems:'center',paddingTop:20,backgroundColor:'white'}}>
        {/* <TextInput  style={styles.input} placeholder='pick time'
        value={time}
        onChangeText={(text) => setTime(text)}
        />
          <TextInput  style={styles.input} placeholder='date'
        value={date}
        onChangeText={(text) => setDate(text)}
        /> */}
           <View>
      <View style={{width:'80%'}}>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <View style={{justifyContent:'center'}}>
            <Text style={{color:'#111B2B',fontWeight:500,fontSize:12,paddingRight:20}}>Select Ride Date</Text>
            </View>
          <DateTimePicker
            value={rideDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            
          />
          </View>
          <View style={{flexDirection:'row',justifyContent:'center',marginTop:20,marginBottom:20}}>
          <View style={{justifyContent:'center'}}>
          <Text style={{color:'#111B2B',fontWeight:500,fontSize:12,paddingRight:20}}>Select Ride Time</Text>
          </View>
              <DateTimePicker
            value={rideTime}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}

          />
          </View>
      </View>
        <View>
        </View>
        <View>

          </View>

    </View>

        {/* <TextInput style={styles.input}
         placeholder='number of passenger'
         value={numberofpassenger}
         keyboardType="numeric"
         onChangeText={(text)=>setNumberofpassenger(text)}/> */}

        <TextInput style={styles.input} placeholder='add pickup note'
        value={pickupnote}
        onChangeText={(Text)=>setPickupnote(Text)}/>
        <View style={{width:'80%',marginBottom:20}}>
          <PassengerInput style={{color:'red'}} value={numberofpassenger} onChange={setNumberofpassenger} />
        </View>
        <Pressable style={{backgroundColor:'#FF6B00',paddingVertical:8,width:'50%',marginBottom:30,alignItems:'center',justifyContent:'center'}} onPress={handleProcess} >
            <Text style={{color:'white',fontWeight:400}}>Proceed</Text>
        </Pressable>

     
    </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignContent:'center',
    marginTop:28
  },
  heading: {
    fontSize: 20,
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginTop:-30

  },
  marker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callout: {
    width: 150,
  },
  calloutText: {
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    top: '12%',
    left: '5%',
    zIndex: 10,
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
    width:'80%',
    height:40,
    textAlign:'left',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize:12
  },
});

export default MapPage;