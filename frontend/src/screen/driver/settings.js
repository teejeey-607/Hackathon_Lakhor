
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput,Modal, Button, Alert, StyleSheet, TouchableOpacity,Pressable,ScrollView} from 'react-native';

import axios from 'axios';
import config from '../../../config';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from './DriverAuthContext';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';



const DriverSettings = ({ navigation, route }) => {


  const options = [
    { label: 'Bhutan National Bank Ltd', value: 'BNB' },
    { label: 'Bank of Bhutan', value: 'BOB' },
    { label: 'Tashi Bank Ltd', value: 'TB' },
    { label: 'Bhutan Development Bank Ltd', value: 'BDBL' },
    { label: 'Druk PNB Ltd', value: 'PNB' },
    { label: 'Digital Kidu', value: 'DK' },
  ];
  const [selectedValue, setSelectedValue] = useState(null);

  const [userData, setUserData] = useState(route.params?.userData);
  const [editMode, setEditMode] = useState(false);
  
  const [editedUser, setEditedUser] = useState({ ...userData });
  const [updatedUser, setUpdatedUser] = useState(null);

  const [inputType, setInputType] = useState(null); // Track clicked input field
  const [bank, setBank] = useState('');

  const [selectedBank, setSelectedBank] = useState(null);

  const handleInputChange = (type) => {
    setInputType(type);
    setModalVisible(true);
  }
    //image
    const [image, setImage] = useState(null);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      delete result.cancelled;
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
      //QR
      const [QR, setQR] = useState(null);
  
      const pickQR = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
    
        delete result.cancelled;
  
        if (!result.canceled) {
          setQR(result.assets[0].uri);
        }
      };
  
      //account No
      const [requiredAccountDigit, setRequiredAccountDigit] = useState(0);

  const {driverlogout}=useAuth()

  const handleEdit = () => {
    setEditMode(true);
  };

  

  const handleUpdateDetails = async () => {
    if (!editedUser.name || !editedUser.cid || !editedUser.mobilenumber) {
      Alert.alert('Error', 'Please enter all details.');
      return;
    }
  
    if (!userData.cid) {
      console.error('CID is not defined.');
      return;
    }
    
  
    try {
      // const userId = userData.userId;
      const trimmedMobileNumber = editedUser.mobileNumber ? editedUser.mobileNumber.trim() : '';
      const updatedUserDetails = {
        name: editedUser.name || '',
        licencenumber: editedUser.licencenumber || '',
        cid: editedUser.cid || '',
        gender: editedUser.gender || '',
        mobilenumber: editedUser.mobilenumber || '',
        vehiclenumber: editedUser.vehiclenumber || '',
        vehiclebrand: editedUser.vehiclebrand || '',
        vehiclecolor: editedUser.vehiclecolor || '',
        vehicletype: editedUser.vehicletype || '',
        vehiclecapacity: editedUser.vehiclecapacity || '',
        bankaccount: editedUser.bankaccount || '',
        accountnumber: editedUser.accountnumber || '',
      };
  
      // Update user details via API
      await axios.put(`${config.API_URL}/api/drivers/${userData.cid}`, updatedUserDetails);

   
      const storedUserDataString = await SecureStore.getItemAsync('formData');
      if (!storedUserDataString) {
        console.error('Stored user data not found');
        return;
      }
  
      const storedUserData = JSON.parse(storedUserDataString);
      const formData = {
        // userId: userData.userId,
        name: editedUser.name || storedUserData.name,
        licencenumber:editMode.licencenumber || storedUserData.licencenumber,
        cid: editedUser.cid || storedUserData.cid,
        gender: editedUser.gender || storedUserData.gender,
        mobilenumber: trimmedMobileNumber || storedUserData.mobilenumber,
        vehiclenumber: editedUser.vehiclenumber || storedUserData.vehiclenumber,
        vehiclebrand: editedUser.vehiclebrand || storedUserData.vehiclebrand,
        vehiclecolor: editedUser.vehiclecolor || storedUserData.vehiclecolor,
        vehicletype: editedUser.vehicletype || storedUserData.vehicletype,
        vehiclecapacity: editedUser.vehiclecapacity || storedUserData.vehiclecapacity,
        bankaccount: editedUser.bankaccount || storedUserData.bankaccount,
        accountnumber: editedUser.accountnumber || storedUserData.accountnumber,
        
      };
  
      await SecureStore.setItemAsync('formData', JSON.stringify(formData));
  
      // Update state after updating SecureStore
      setUpdatedUser(formData);
      setEditMode(false);
      Alert.alert('Success', 'Details updated successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('driverAccount') },
      ]);
      
    } catch (error) {
      console.error('Axios Error:', error);
  
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
  
      Alert.alert('Error', errorMessage);
    }
  };



  const handleDeletePress = async () => {
    try {
      // Display a confirmation alert
      Alert.alert(
        'Confirmation',
        'Are you sure you want to delete your account?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              // Delete user account via API
              await axios.delete(`${config.API_URL}/api/drivers/${userData.cid}`, {
                headers: {
                  cid: userData.cid, // Make sure cid is set here
                },
              });
  
              // Clear the stored user data in SecureStore
              await SecureStore.deleteItemAsync('formData');
  
              // Logout or handle the deletion as needed
              driverlogout();
  
              // Show success message
              Alert.alert(
                'Driver account deleted.',
                'OK',
                [
                  { text: 'OK', onPress: () => navigation.navigate('HomeScreen') },
                ],
                { cancelable: false }
              );
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Axios Error:', error);
  
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
  
      Alert.alert('Error', errorMessage);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#0F992E" />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        {editMode ? (
          <>
          <ScrollView>
        

         <View style={styles.content}>

  <View style={styles.group}> 

<Text style={styles.contentHeader}>BANK INFO</Text>

            <Text style={styles.label}>Bank Type.</Text>
    <View style={styles.inputContainer}>
    <View style={{justifyContent:'center',alignItems:'center',width:'100%',paddingHorizontal:15}}>
      <RNPickerSelect
      style={{justifyContent:'center',alignItems:'center'}}
        // placeholder={{ label: 'Select a bank...', value: editedUser.bankaccount  }}
        placeholder={{  label: 'Select Bank',value: editedUser.bankaccount,textColor: 'black'}}
        items={options}
        defaultValue={editedUser.bankaccount}
    
        value={selectedValue}

        onValueChange={(value) => {
          setSelectedBank(value);
        
          setEditedUser(prev => ({ ...prev, bankaccount: value }));
        }}
      />
    </View>
    </View>
      {selectedBank && <Text style={{marginTop:5}}>Selected Bank:<Text style={{paddingLeft:10,fontWeight:500}}>{selectedBank}</Text></Text>}
     


            <Text style={styles.label}>Account No.</Text>
            <View style={styles.inputContainer}>
            <View style={{justifyContent:'center',width:'100%'}}>
            <TextInput
              placeholder="accountNumber"
              value={editedUser.accountnumber}
              onChangeText={(text) =>
                setEditedUser((prev) => ({ ...prev, accountnumber: text }))
              }
              style={styles.input}
            />
            </View>
            </View>
   
</View>
<View style={{alignItems:'center'}}>
<TouchableOpacity
onPress={handleUpdateDetails} 
style={{...styles.actionBtn,backgroundColor:'#2D2D2D',marginTop:20,alignItems:'center'}} >
 <Text style={{color:'white'}}>Save Changes</Text>
</TouchableOpacity>
</View>
</View>
            


            </ScrollView>
          </>
        ) : (
          <>

      

  <View>   
<View style={styles.content}>

<View style={styles.group}>
  <Text style={styles.contentHeader}>PERSONAL INFO</Text>
     <Text style={styles.label}>Passenger's Name</Text>
     <View style={styles.inputContainer}>
      <View style={{justifyContent:'center',width:'100%'}}>
      <Text style={styles.input}>
        {userData.name}

      </Text>
      </View>
    
    </View>
    <Text style={styles.label}>CID / Passport / Work Permit No.</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
<Text style={styles.input}>
    {userData.cid}
  </Text>
</View>
</View>

<Text style={styles.label}>Gender</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
    <Text style={styles.input}>
        {userData.gender}
      </Text>
  </View>
  </View>

    <Text style={styles.label}>Phone Number</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
<Text style={styles.input}>
    {userData.mobilenumber}
  </Text>
  </View>
</View>
    

  

</View>
<View style={styles.group}>


  <Text style={styles.contentHeader}>VEHICLE INFO</Text>
  <Text style={styles.label}>Licence No.</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
<Text style={styles.input}>
    {userData.licencenumber}
  </Text>
  </View>
</View>


<Text style={styles.label}>Vehicle No.</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
<Text style={styles.input}>
    {userData.vehiclenumber}
  </Text>
  </View>
</View>

<Text style={styles.label}>Vehicle color</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
<Text style={styles.input}>
    {userData.vehiclecolor}
  </Text>
  </View>
</View>

<Text style={styles.label}>Vehicle type.</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
<Text style={styles.input}>
    {userData.vehicletype}
  </Text>
  </View>
</View>

<Text style={styles.label}>vehicle capacity</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
<Text style={styles.input}>
    {userData.vehiclecapacity}
  </Text>
  </View>
</View>


<Text style={styles.contentHeader}>BANK INFO</Text>


<Text style={styles.label}>Bank type</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
<Text style={styles.input}>
    {userData.bankaccount}
  </Text>
  </View>
</View>
  <Text style={styles.label}>Account No.</Text>

<View style={styles.inputContainer}>
<View style={{justifyContent:'center',width:'100%'}}>
<Text style={styles.input}>
    {userData.accountnumber}
  </Text>
  </View>
</View>

   
</View>
</View>

{/* 
<Button title="Edit" onPress={handleEdit} /> */}
<View style={{alignItems:'center',paddingBottom:100}}>
   <TouchableOpacity style={{...styles.actionBtn,backgroundColor:'#2D2D2D',marginTop:20}} onPress={handleEdit}>
   <View style={{justifyContent:'center'}}>
              <Ionicons name="create-outline" size={20} color="white" />
              </View>
              <View style={{justifyContent:'center'}}>
              <Text style={{color:'white',paddingLeft:10}}>Edit Details</Text>
              </View>
      </TouchableOpacity>

    <TouchableOpacity
onPress={handleDeletePress}
style={{...styles.actionBtn,backgroundColor:'#D11A2A',marginTop:10}} 
>
<View style={{justifyContent:'center'}}>
              <Ionicons name="trash" size={20} color="white" />
              </View>
              <View style={{justifyContent:'center'}}>
              <Text style={{color:'white',paddingLeft:10}}>Delete Account</Text>
              </View>
</TouchableOpacity>
</View>
</View> 
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  button: {
    position: 'absolute',
    top: '-2%',
    left: '5%',
    zIndex: 10,
    padding: 5,
  },
  input: {
    marginVertical: 8,
    padding: 8,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
  },
  content:{
    paddingHorizontal:'8%'
  },
  group:{
    
  },
  contentHeader:{
    marginTop:'10%',
    color:'#2D2D2D',
    fontSize:14,
    alignSelf:'center',
    fontWeight:'500'
  },
  inputContainer:{
    borderWidth:1,
    borderColor:'#DEDDDD',
    width:'100%',
    borderRadius:10,
    paddingVertical:5,
    flexDirection:'row',
    height:40,
    alignItems:'center'
  },
  label:{
    fontSize:12,
    fontWeight:'400',
    paddingBottom:7,
    marginTop:10
  },
  input:{
    alignSelf:'flex-start',
    color:'#474747',
    paddingLeft:15,
    fontSize:13,
    width:'80%',

  },
  change:{
  justifyContent:'center',
  width:'16%',
  alignItems:'flex-end'
  },
  changeText:{
    fontSize:13,
    fontWeight:'400',
    color:'#FF6B00'
  },
  centeredView: {
    flex: 1,
    backgroundColor:'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    },
    actionBtn:{
      flexDirection:'row',
      height:40,
      width:150,
      justifyContent:'center',
  
    }
});

export default DriverSettings;


