import React, { useState, useEffect } from 'react';
import { StyleSheet,Alert, Text, View,StatusBar,Image, TextInput,ScrollView, Pressable,Linking,KeyboardAvoidingView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import config from "../../../config";
import * as SecureStore from 'expo-secure-store';

export default function PassengerContact(){
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');

    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
   

    const fetchRegisteredData = async () => {
        try {
          const registeredDataString = await SecureStore.getItemAsync('registeredData');
          if (registeredDataString) {
            const registeredData = JSON.parse(registeredDataString);
    
            // console.log('Registered Data:', registeredData);
            setName(registeredData.name)
            setMobileNumber(registeredData.mobilenumber)
        
        }
          
        } catch (error) {
          console.error('Error fetching registered data:', error);
        } finally {
        }
      };
    
      useEffect(() => {
        fetchRegisteredData();
      }, []);
    

    const submitFeedback = async () => {
        try {
            // Check if required fields are empty
            if (!name.trim() || !mobileNumber.trim() || !message.trim()) {
                Alert.alert('Empty message', 'Please enter your query/feedback.');
                return;
            }

            // Disable the submit button
            setIsSubmitting(true);

            // Send feedback data to the backend
            const response = await axios.post(`${config.API_URL}/api/feedback`, {
                name: name.trim(),
                mobilenumber: mobileNumber.trim(),
                message: message.trim(),
            });

            // Log success message
            Alert.alert('We have received your query/feedback', name);

            // Clear input fields
            setMessage('');

            return response.data;
        } catch (error) {
            // Display alert for empty fields
            Alert.alert('Error', 'Failed to submit feedback. Please try again later.');
            // Log error
            console.error('Error submitting feedback:', error);
            throw error;
        } finally {
            // Enable the submit button
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{flex:1}}
        behavior={Platform.OS === "ios" ? "padding" : null}>
            <ScrollView style={styles.container} contentContainerStyle={{flex:1}} bounces={false}>
            <View style={styles.header}>

            </View>
            <View style={{ marginTop: 100, position: 'absolute', zIndex: 5, width: '100%', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Image source={require('../../../assets/image/taxi.png')} style={{ resizeMode: 'contain', height: 70, width: 100 }} />
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ color: '#474747', fontWeight: 500, fontSize: 16 }}>CONTACT US</Text>
                    </View>
                </View>
            </View>
            {/* content */}
            <View style={styles.content}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#474747', fontWeight: 600, fontSize: 15 }}>Contact Us Here</Text>
                    <Text style={{ color: '#474747', fontSize: 10, fontWeight: 400 }}>Druk Lakhor is here for you? How can we help?</Text>
                </View>
                {/* form */}
                <View>
                    <View style={{ paddingHorizontal: 25, marginTop: 20 }}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                        />

                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={mobileNumber}
                        />

                        <Text style={styles.label}>Message</Text>
                        <TextInput
                            style={[styles.input, { height: 100 }]}
                            placeholder="Enter Your Message"
                            multiline={true}
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={message}
                            onChangeText={setMessage}
                        />
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Pressable
                                style={({ pressed }) => ({
                                    backgroundColor: pressed ? '#D45D00' : '#FF6B00',
                                    paddingVertical: 10,
                                    alignItems: 'center',
                                    width: 200,
                                    opacity: isSubmitting ? 0.5 : 1, // Disable the button if submitting
                                })}
                                android_ripple={{ color: '#0000' }}
                                onPress={submitFeedback}
                                disabled={isSubmitting} // Prevent multiple submissions
                            >
                                <Text style={{ fontSize: 11, fontWeight: 300, color: 'white' }}>Submit</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            {/* call */}
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 500 }}>OR</Text>
                <Text style={{ fontSize: 13, fontWeight: 400 }}>Contact Us by</Text>
                <View style={{ flexDirection: 'row', height: 30, marginTop: 10, marginBottom: 15 }}>
                    <Pressable
                        onPress={() => {
                            // Handle the call press action here
                            const phoneNumber = '17123456'; // Replace with your phone number
                            Linking.openURL(`tel:${phoneNumber}`);
                        }}
                        style={({ pressed }) => ({
                            padding: 3,
                            borderWidth: 1,
                            borderColor: '#969696',
                            backgroundColor: pressed ? '#D1D1D1' : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 15,
                            transform: [{ scale: pressed ? 0.95 : 1 }],
                        })}
                    >
                        <Ionicons name="call-outline" size={20} color="black" />
                    </Pressable>

                    <View style={{ paddingVertical: '10%' }}></View>

                    <Pressable
                        onPress={() => {
                            // Handle the WhatsApp press action here
                            const phoneNumber = '17123456'; // Replace with your phone number
                            Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
                        }}
                        style={({ pressed }) => ({
                            padding: 3,
                            borderWidth: 1,
                            borderColor: '#969696',
                            backgroundColor: pressed ? '#D1D1D1' : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 15,
                            transform: [{ scale: pressed ? 0.95 : 1 }],
                        })}
                    >
                        <Ionicons name="logo-whatsapp" size={20} color="black" />
                    </Pressable>
                </View>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#FBD3A8',
        height: 220,
        alignItems: 'center',
    },
    content: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        zIndex: 2,
        marginTop: -75,
        paddingVertical: 25,
        borderRadius: 10,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        marginBottom: 10
    },
    input: {
        borderColor: '#DEDDDD',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 8,
        paddingVertical: 5,
        height:40,
        paddingHorizontal: 10,
        color: '#474747',
        fontSize: 12
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 10
    }
});


// import { StyleSheet, Text, View,StatusBar,Image, TextInput,ScrollView, Pressable,Linking} from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export default function PassengerContact(){
//     StatusBar.setBackgroundColor('transparent');
//     StatusBar.setBarStyle('dark-content');
//     return (
//         <ScrollView style={styles.container}>
//             <View style={styles.header}>

//             </View>
//             <View style={{marginTop:100,position:'absolute',zIndex:5,width:'100%',alignItems:'center'}}>
//                     <View style={{flexDirection:'row'}}>
//                     <View>
//                         <Image  source={require('../../../assets/image/taxi.png')} style={{resizeMode: 'contain',height:70,width:100}}/>
//                     </View>
//                     <View style={{justifyContent:'center'}}>
//                         <Text style={{color:'#474747',fontWeight:500,fontSize:15}}>CONTACT US</Text>
//                     </View>
//                 </View>
//             </View>
//             {/* content */}
//             <View style={styles.content}>
//                 <View style={{alignItems:'center'}}>
//                 <Text style={{color:'#474747',fontWeight:600,fontSize:15}}>Contact Us Here</Text>
//                 <Text style={{color:'#474747',fontSize:10,fontWeight:400}}>Druk Lakhor is here for you? How can we help?</Text>
//                 </View>
//                 {/* form */}
//                 <View>
//                     <View style={{paddingHorizontal:25,marginTop:20}}>
//                         <Text style={styles.label}>Name</Text>
//                         <TextInput style={styles.input}
//                         placeholder='Enter Your Name'/>

//                         <Text style={styles.label}>Phone Number</Text>
//                         <TextInput style={styles.input}
//                         placeholder='Enter Your Number'/>

//                         <Text style={styles.label}>Message</Text>
//                         <TextInput style={styles.input}
//                             placeholder="Enter Your Message"
//                             multiline={true}
//                             numberOfLines={5}
//                             textAlignVertical="top" 
//                         />
//                         <View style={{alignItems:'center',marginTop:20}}>
//                         <Pressable
//                                 style={({ pressed }) => ({
//                                 backgroundColor: pressed ? '#D45D00' : '#FF6B00',
//                                 paddingVertical: 10,
//                                 alignItems: 'center',
//                                 width: 200,
//                                 })}
//                                 android_ripple={{ color: '#0000' }}
//                             >
//                             <Text style={{fontSize:11,fontWeight:300,color:'white'}}>Submit</Text>
//                         </Pressable>
//                     </View>
//                     </View>

                    
//                 </View>
                
//             </View>
//             {/* call */}
//             <View style={{alignItems:'center'}}>
//                 <Text style={{fontSize:15,fontWeight:500}}>OR</Text>
//                 <Text style={{fontSize:13,fontWeight:400}}>Contact Us by</Text>
//                 <View style={{flexDirection:'row',height:30,marginTop:10,marginBottom:15}}>
//                             <Pressable
//                                 onPress={() => {
//                                 // Handle the call press action here
//                                 const phoneNumber = '17123456'; // Replace with your phone number
//                                 Linking.openURL(`tel:${phoneNumber}`);
//                                 }}
//                                 style={({ pressed }) => ({
//                                 padding: 3,
//                                 borderWidth: 1,
//                                 borderColor: '#969696',
//                                 backgroundColor: pressed ? '#D1D1D1' : 'transparent',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 marginHorizontal:15,
//                                 transform: [{ scale: pressed ? 0.95 : 1 }],

//                                 })}
//                             >
//                                 <Ionicons name="call-outline" size={20} color="black" />
//                             </Pressable>

//                             <View style={{ paddingVertical: '10%' }}></View>

//                             <Pressable
//                                 onPress={() => {
//                                 // Handle the WhatsApp press action here
//                                 const phoneNumber = '17123456'; // Replace with your phone number
//                                 Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
//                                 }}
//                                 style={({ pressed }) => ({
//                                 padding: 3,
//                                 borderWidth: 1,
//                                 borderColor: '#969696',
//                                 backgroundColor: pressed ? '#D1D1D1' : 'transparent',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 marginHorizontal:15,
//                                 transform: [{ scale: pressed ? 0.95 : 1 }]
//                                 })}
//                             >
//                                 <Ionicons name="logo-whatsapp" size={20} color="black" />
//                             </Pressable>
//                             </View>
//             </View>
//         </ScrollView>
//     )
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     header: {
//         backgroundColor:'#FBD3A8',
//         height:230,
//         alignItems:'center',
//     },
//     content:{
//         backgroundColor:'white' ,
//         marginHorizontal:20,
//         zIndex:2,
//         marginTop:-75,
//         paddingVertical:25,
//         borderRadius:10,
//         shadowColor: "#000000",
//         shadowOffset: {
//         width: 0,
//         height: 3,
//         },
//         shadowOpacity:  0.17,
//         shadowRadius: 3.05,
//         elevation: 4,
//         marginBottom:10

//     },
//     input:{
//         borderColor:'#DEDDDD',
//         borderWidth:1,
//         borderRadius:5,
//         marginTop:8,
//         paddingVertical:5,
//         paddingHorizontal:10,
//         color:'#474747',
//         fontSize:12
//     },
//     label:{
//         fontSize:13,
//         fontWeight:'500',
//         marginTop:10
//     }
//   });
  