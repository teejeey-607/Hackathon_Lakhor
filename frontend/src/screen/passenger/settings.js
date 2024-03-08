
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity,Pressable } from 'react-native';

import axios from 'axios';
import config from '../../../config';
import isEqual from 'lodash/isEqual'; // Import isEqual from lodash
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from './AuthContext';

const PassengerSettings = ({ navigation, route }) => {
  const [userData, setUserData] = useState(route.params?.userData);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...userData });
  const [updatedUser, setUpdatedUser] = useState(null);

  const {logout}=useAuth()

  const handleEdit = () => {
    setEditMode(true);
  };

  

  const handleUpdateDetails = async () => {
    if (!editedUser.name || !editedUser.cid || !editedUser.mobilenumber) {
      Alert.alert('Error', 'Please enter all details.');
      return;
    }
  
    if (!userData || !userData.userId) {
      console.error('User ID is undefined');
      return;
    }
  
    try {
      const userId = userData.userId;
      const trimmedMobileNumber = editedUser.mobilenumber ? editedUser.mobilenumber.trim() : '';
  
      // Update user details via API
      await axios.put(`${config.API_URL}/api/passengers/${userId}`, {
        name: editedUser.name,
        cid: editedUser.cid,
        gender: editedUser.gender,
        mobilenumber: trimmedMobileNumber,
        emergencycontactnumber: editedUser.emergencycontactnumber,
      });
  
      // Update stored user details in SecureStore
      const storedUserDataString = await SecureStore.getItemAsync('registeredData');
      if (!storedUserDataString) {
        console.error('Stored user data not found');
        return;
      }
  
      const storedUserData = JSON.parse(storedUserDataString);
      const updatedUserData = {
        userId: userData.userId,
        name: editedUser.name || storedUserData.name,
        cid: editedUser.cid || storedUserData.cid,
        gender: editedUser.gender || storedUserData.gender,
        mobilenumber: trimmedMobileNumber || storedUserData.mobilenumber,
        emergencycontactnumber: editedUser.emergencycontactnumber || storedUserData.emergencycontactnumber,
      };
  
      await SecureStore.setItemAsync('registeredData', JSON.stringify(updatedUserData));
  
      // Update state after updating SecureStore
      setUpdatedUser(updatedUserData);
      setEditMode(false);
      Alert.alert('Success', 'Details updated successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('passengerAccount') },
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
              await axios.delete(`${config.API_URL}/api/passengers/${userData.userId}`, {
                headers: {
                  cid: userData.cid, // Make sure cid is set here
                },
              });
  
              // Clear the stored user data in SecureStore
              await SecureStore.deleteItemAsync('registeredData');
  
              // Logout or handle the deletion as needed
              logout();
  
              // Show success message
              Alert.alert(
                'User account deleted.',
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FF6B00" />
      </TouchableOpacity>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>

        {editMode ? (
          <>
              <View style={styles.content}>
              <View style={styles.group}>
                <Text style={styles.contentHeader}>PERSONAL INFO</Text>
                  <Text style={styles.label}>Passenger's Name</Text>
                  <View style={styles.inputContainer}>
                  <View style={{width:'100%'}}>
                    <TextInput style={styles.input}                   
                    value={editedUser.name}
                    editable={false}
                    onChangeText={(text) => setEditedUser((prev) => ({ ...prev, name: text }))}
                  />
                  </View> 
                  </View>

                  <Text style={styles.label}>CID / Passport / Work Permit No.</Text>
                  <View style={styles.inputContainer}>
                  <View style={{width:'100%'}}>
                  <TextInput style={styles.input}
                    editable={false}
                    value={editedUser.cid}
                    onChangeText={(text) => setEditedUser((prev) => ({ ...prev, cid: text }))}
                  />
                  </View>
                  
                    
                  </View>
              </View>
              <View style={styles.group}>
                <Text style={styles.contentHeader}>CONTACT INFO</Text>
                  <Text style={styles.label}>Mobile No.</Text>
                  <View style={styles.inputContainer}>
                  <View style={{width:'100%'}}>
                    <View style={{...styles.input,flexDirection:'row'}}>
                    <View style={{justifyContent:'center'}}>
                      <Text style={{fontSize:13,color:'#888888'}}>+975</Text>
                    </View>
                    <View style={{justifyContent:'center',paddingLeft:15}}>
                      <View style={{borderWidth:0.5,borderColor:'#888888',height:20}}></View>
                    </View>
                    <View style={{justifyContent:'center',width:'100%'}}>
                    <TextInput style={styles.input}
                    
                    value={editedUser.mobilenumber}
                    onChangeText={(text) => setEditedUser((prev) => ({ ...prev, mobilenumber: text }))}
                  />
                  </View>
                    </View>
                  </View>
                  </View>

                  <Text style={styles.label}>Emergency Contact No.</Text>
                  <View style={styles.inputContainer}>
                  <View style={{width:'100%'}}>
                    <View style={{...styles.input,flexDirection:'row'}}>
                    <View style={{justifyContent:'center'}}>
                      <Text style={{fontSize:13,color:'#888888'}}>+975</Text>
                    </View>
                    <View style={{justifyContent:'center',paddingLeft:15}}>
                      <View style={{borderWidth:0.5,borderColor:'#888888',height:20}}></View>
                    </View>
                    <View style={{justifyContent:'center',width:'100%'}}>
                    <TextInput style={styles.input}
                    
                    value={editedUser.emergencycontactnumber}
                    onChangeText={(text) => setEditedUser((prev) => ({ ...prev, emergencycontactnumber: text }))}
                  />
                  </View>
                    </View>
                    </View>
                    {/* <TouchableOpacity style={styles.change} onPress={() => handleInputChange('EM')}>
                    <Ionicons name="create-outline" size={20} color="#FF6B00" />
                    </TouchableOpacity> */}
                  </View>
              </View>
              </View>
              <TouchableOpacity style={{...styles.actionBtn,backgroundColor:'#2D2D2D',marginTop:20,alignItems:'center'}} onPress={handleUpdateDetails}>
                  <Text style={{color:'white'}}>Save Changes</Text>
              </TouchableOpacity>
          </>
        ) : (
          <>
            {/* <Text>Name: {userData.name}</Text>
            <Text>CID/Passport/Permit No: {userData.cid}</Text>
            <Text>Gender: {userData.gender}</Text>
            <Text>Mobile Number: {userData.mobilenumber}</Text>
            <Text>Emergency Contact Number: {userData.emergencycontactnumber}</Text> */}

<View style={styles.content}>

        <View style={styles.group}>
          <Text style={styles.contentHeader}>PERSONAL INFO</Text>
              <Text style={styles.label}>Passenger's Name</Text>
              <View style={styles.inputContainer}>
              <View style={{width:'100%'}}>
              <Text style={styles.input}>
                {userData.name}

              </Text>
              </View>
            </View>

            <Text style={styles.label}>CID / Passport / Work Permit No.</Text>
            <View style={styles.inputContainer}>
            <View style={{width:'100%'}}>
            <Text style={styles.input}>
                {userData.cid}

              </Text>
              </View>
             
              
            </View>
        </View>
        <View style={styles.group}>
          <Text style={styles.contentHeader}>CONTACT INFO</Text>
            <Text style={styles.label}>Mobile No.</Text>
            <View style={styles.inputContainer}>
            <View style={{width:'100%'}}>
              <View style={{...styles.input,flexDirection:'row'}}>
              <View style={{justifyContent:'center'}}>
                <Text style={{fontSize:13,color:'#888888'}}>+975</Text>
              </View>
              <View style={{justifyContent:'center',paddingLeft:15}}>
                <View style={{borderWidth:0.5,borderColor:'#888888',height:20}}></View>
              </View>
              <View style={{justifyContent:'center',width:'100%'}}>
              <Text style={styles.input}>
                {userData.mobilenumber}

              </Text>
              </View>
              </View>
           </View>
            </View>

            <Text style={styles.label}>Emergency Contact No.</Text>
            <View style={styles.inputContainer}>
            <View style={{width:'100%'}}>
              <View style={{...styles.input,flexDirection:'row'}}>
              <View style={{justifyContent:'center'}}>
                <Text style={{fontSize:13,color:'#888888'}}>+975</Text>
              </View>
              <View style={{justifyContent:'center',paddingLeft:15}}>
                <View style={{borderWidth:0.5,borderColor:'#888888',height:20}}></View>
              </View>
              <View style={{justifyContent:'center',width:'100%'}}>
              <Text style={styles.input}>
                {userData.emergencycontactnumber}

              </Text>
              </View>
              </View>
              </View>
              {/* <TouchableOpacity style={styles.change} onPress={() => handleInputChange('EM')}>
              <Ionicons name="create-outline" size={20} color="#FF6B00" />
              </TouchableOpacity> */}
            </View>
        </View>
      </View>

{/* 
        <Button title="Edit" onPress={handleEdit} /> */}
       
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
           
           
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:50, // To adjust for the status bar
    backgroundColor:'white'
  },
  button: {
    position:'absolute',
    top: '5%',
    left: '5%',
    zIndex: 10, // To ensure it appears above other content
    padding: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  content:{
    paddingHorizontal:'8%',
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
    width:'80%'

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
  actionBtn:{
    flexDirection:'row',
    height:40,
    width:150,
    justifyContent:'center',

  },
  centeredView: {
    flex: 1,
    backgroundColor:'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    },

});

export default PassengerSettings;

