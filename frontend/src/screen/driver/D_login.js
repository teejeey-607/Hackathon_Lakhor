

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, Image, StyleSheet, ActivityIndicator,ScrollView,KeyboardAvoidingView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from './DriverAuthContext'

export default function Login({ navigation }) {
  const [goPressed, setGoPressed] = useState(false);
  const [mobilenumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(true);

  const { driverlogin } = useAuth();

  const handleGoPressIn = () => {
    setGoPressed(true);
  };

  const handleGoPressOut = () => {
    setGoPressed(false);
  };


  const handleLogin = async () => {
    console.log("Mobile Number:", mobilenumber);

    // Ensure mobilenumber is defined before trimming
    const trimmedMobileNumber = mobilenumber ? mobilenumber.trim() : "";

    if (trimmedMobileNumber !== "") {
      const storedRegisteredData = await SecureStore.getItemAsync("formData");
      console.log("Stored Registered Data:", storedRegisteredData);

      if (storedRegisteredData) {
        const formData = JSON.parse(storedRegisteredData);
        console.log("Parsed Registered Data:", formData);

        const storedMobileNumber = formData.mobilenumber;
        console.log("Stored Mobile Number:", storedMobileNumber);

        if (trimmedMobileNumber === storedMobileNumber) {
          driverlogin({
            // userId: formData.userId,
            name: formData.name,
            cid: formData.cid,
            licenceNumber: formData.licencenumber,
            gender:formData.gender,
            mobilenumber: formData.mobilenumber,
            vehiclenumber:formData.vehiclenumber,
            vehiclebrand:formData.vehiclebrand,
            vehiclecolor:formData.vehiclecolor,
            vehicletype:formData.vehicletype,
            vehiclecapacity:formData.vehiclecapacity,
            bankaccount:formData.bankaccount,
            accountnumber:formData.accountnumber
          });
          
          
          navigation.navigate('D_OTP');
        } else {
          Alert.alert(
            "Please enter the registered mobile number."
          );
        }
      } else {
        Alert.alert("User not registered. Please register first.");
      }
    } else {
      Alert.alert("Please enter a valid mobile number");
    }
  };

  useEffect(() => {
    const fetchStoredMobileNumber = async () => {
      try {
        const storedRegisteredData = await SecureStore.getItemAsync("formData");
        if (storedRegisteredData) {
          const formData = JSON.parse(storedRegisteredData);
          const storedMobileNumber = formData.mobilenumber;
          setMobileNumber(storedMobileNumber);
        }
        console.log('store', storedRegisteredData);
      } catch (error) {
        console.error("Error fetching stored mobile number:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStoredMobileNumber();
  }, []);
  
  console.log('mobilenumber', mobilenumber);

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

    return(
      <KeyboardAvoidingView style={{flex:1}}
      behavior={Platform.OS === "ios" ? "padding" : null}>
          <ScrollView contentContainerStyle={{flex:1}} bounces={false}>
        <View style={styles.mainContainer}>

            <Image style={styles.logo}  source={require('../../../assets/image/logo.png')}/>
            <Image style={{width:"80%",resizeMode:"contain"}}  source={require('../../../assets/image/login.png')}/>
            <View style={styles.register}>
                <View>
                <Text style={[styles.text,{  marginBottom:"5%"}]}>
                We wish you a good day ahead!
                </Text>
                {/*Mobile No */}
                <View style={{flexDirection:"row"}}>
                    <View style={styles.inputContainer}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flexDirection:'row',width:"30%",borderRightWidth:1,borderRightColor:"black",height:"50%",alignItems:'center',alignSelf:'center'}}>
                        <Image style={{width:"30%",resizeMode:"contain",top:1}}  source={require('../../../assets/image/bhutan.png')}/>
                        <Text style={{fontSize:12,color:'black',marginLeft:'5%'}}>+975</Text>
                        </View>                
                   
                        <TextInput
                        value={mobilenumber}
                        onChangeText={setMobileNumber}
                        placeholder="Mobile Number"
                        style={styles.input}
                        keyboardType='numeric'
                        maxLength={8}/>
                        </View>
                    </View>
                    <View style={{justifyContent:'center',width:"20%",marginTop:"5%"}}>
                    <Pressable
                        style={{
                        backgroundColor:'#0F992E',
                        paddingVertical: '20%',
                        marginLeft: '10%',
                        borderRadius: 10,
                        alignItems: 'center',
                        transform: [{ scale: goPressed ? 0.95 : 1 }],
                        }}
                        onPress={handleLogin}
                        onPressIn={handleGoPressIn}
                        onPressOut={handleGoPressOut}
                    >
                        <Text style={{ fontSize: 14, color: 'white', fontWeight: '600' }}>Go</Text>
                    </Pressable>
                    </View>
                </View>


                </View>

            </View>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
        );
    }
    const styles = StyleSheet.create({
        mainContainer:{
            flex: 1, 
            backgroundColor:'white',
            alignItems:'center'
    
        },
        logo:{     
            width:"50%",
            marginTop:"25%",
            resizeMode:"contain",
            height:'10%'
        },

        register:{
            marginTop:"5%",
            paddingHorizontal:"10%",
            width:"100%"
        },
        image:{
            marginTop:"20%",
            alignSelf:"center"
        },
        text:{
            fontWeight:"800",
            fontSize:12,
            alignSelf:'center'
        },
        inputContainer: {
            borderColor: '#D9D9D9',
            borderWidth: 1,
            borderRadius: 10,
            paddingLeft: 10,
            paddingRight: 10,
            marginTop:"5%",
            backgroundColor:'#D9D9D9',
            width:"80%",
        },
        input:{
            height: 40,
            zIndex: 0,
            color:"black",
            fontSize:12,
            marginLeft:"5%"
        },
        placeholderStyle: {
            fontSize: 10,
            color:"gray"
        },

    })  

