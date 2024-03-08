import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,TextInput,label,placeholder,Pressable} from 'react-native';
import React, { useState, useRef } from 'react';

export default function OTP({navigation}){
    const [otp, setOtp] = useState(['', '', '', '']);
    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Move focus to the next box if the current one has a value
        if (value && index < newOtp.length - 1) {
        inputs[index + 1].focus();
        }
    };
    const inputs = [];

    // on Press
    const [startPressed, setStartPressed] = useState(false);

    const handleStartPressIn = () => {
    setStartPressed(true);
    };
  
    const handleStartPressOut = () => {
    setStartPressed(false);
    };
  
    return(
        <View style={styles.mainContainer}>


            <Image style={styles.logo}  source={require('../../../assets/image/logo.png')}/>
            <Image style={{width:"80%",resizeMode:"contain"}}  source={require('../../../assets/image/login.png')}/>
            <View style={styles.register}>
                <View>
                <Text style={[styles.text,{  marginBottom:"5%"}]}>
                Phone Verification
                </Text>
                <View style={{alignItems:"center"}}>
                    <Text style={{color:"#696969",fontSize:12}}>
                    Please type the 
                        <Text style={{fontWeight:"600"}}> 4 digit code </Text> 
                        sent to 
                    </Text>
                    <Text style={{color:"#696969",fontSize:12}}>+975 17321432</Text>
                </View>
                {/*Mobile No */}
                <View style={{flexDirection:"row",marginTop:"5%"}}>
                <View style={styles.container}>
                    {otp.map((digit, index) => (
                        <TextInput
                        key={index}
                        style={styles.box}
                        maxLength={1}
                        keyboardType="numeric"
                        onChangeText={(value) => handleOtpChange(value, index)}
                        value={digit}
                        ref={(input) => {
                            inputs[index] = input;
                        }}
                        />
                    ))}
                    </View>
                    <View style={{justifyContent:'center',width:"20%"}}>
                    <Pressable
                        style={{
                        backgroundColor: '#0F992E',
                        paddingVertical: '20%',
                        marginLeft: '10%',
                        borderRadius: 10,
                        alignItems: 'center',
                        transform: [{ scale: startPressed ? 0.95 : 1 }],
                        }}
                        onPress={() => navigation.navigate('DriverTab')}
                        onPressIn={handleStartPressIn}
                        onPressOut={handleStartPressOut}
                    >
                        <Text style={{ fontSize: 14, color: 'white', fontWeight: '600' }}>Start</Text>
                    </Pressable>
                    </View>

                </View>
                    <View style={{marginTop:"10%",alignItems:"center",flexDirection:"row",justifyContent:'center'}}>
                        <View>
                            <Text>Didn't get OTP code? </Text>
                        </View>
                        <View>
                            <Pressable style={{marginLeft:0}}>
                                <Text style={{fontWeight:600, color:"#0F992E",textDecorationLine: 'underline',}}>Resend</Text>
                            </Pressable>
                        </View>
                    </View>


                </View>

            </View>
        </View>
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
            marginTop:"-5%",
            paddingHorizontal:"10%",
            width:"100%"
        },
        image:{
            marginTop:"20%",
            alignSelf:"center"
        },
        text:{
            fontWeight:"800",
            fontSize:18,
            alignSelf:'center'
          
        },
        container: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width:"80%"
          },
          box: {
            borderWidth: 1,
            borderColor: '#BDBDBD',
            margin: 4,
            borderRadius:10,
            textAlign: 'center',
            fontSize: 16,
            width:"22%",
            height:"100%"

          },
    })  
