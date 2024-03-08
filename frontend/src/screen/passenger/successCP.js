// SuccessAlert.js
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity,Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo and have installed the Ionicons library
import { useState } from 'react';
import { useRoute } from '@react-navigation/native';

const ConfirmPassengerSuccess = ({ visible,navigation}) => {

    const [rating, setRating] = useState(0);  // Initial rating value

    const handleStarPress = (selectedRating) => {
      setRating(selectedRating);
    };
    const route = useRoute();
    const handlePress = () => {
      // Check the current screen name and navigate accordingly
      if (route.name === 'payment') {
        navigation.navigate('passengerHome');
      } else if (route.name === 'pay') {
          navigation.navigate('myRide');
    };
  }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Image style={styles.payment} source={require('../../../assets/image/success.png')} />
                    <Text style={styles.modalText}>CONGRATULATION</Text>
                    <Text style={{fontSize:10,marginTop:5}}>We wish you have a good day ahead</Text>

                    <View style={{backgroundColor:'white',width:'100%',marginTop:'5%'}}>
                        <View style={{paddingHorizontal:'8%',alignItems:'center',paddingTop:'5%'}}>
                            {/* <Text style={{fontWeight:500,fontSize:11}}>Would you like to rate your Driver? (optional)</Text> */}
                                {/* <View style={{flexDirection:'row',paddingTop:'8%'}}>
                                    <View style={{width:'50%',alignItems:'flex-start'}}>
                                        <View>
                                            <Image style={styles.profile} source={require('../../../assets/image/deleteItLater.jpg')} />
                                            <Text style={{fontWeight:500,fontSize:12,alignSelf:'center'}}>Sonam Wangyel</Text>
                                        </View>
                                    </View>
                                    <View style={{justifyContent:'center',width:'40%',alignItems:'flex-end'}}>
                                        <View>
                                            <Image style={{ width:55,height:30,resizeMode:'contain'}} source={require('../../../assets/image/car.png')} />
                                            <Text style={{fontSize:14,fontWeight:500}}>BP-1-B7330 </Text>
                                            <Text style={{fontSize:10}}>WagonR - White</Text>
                                        </View>
                                    </View>
                                </View> */}
                                {/* <View style={{ flexDirection: 'row' ,marginTop:10}}>
                                    {[1, 2, 3, 4, 5].map((index) => (
                                        <Pressable key={index} onPress={() => handleStarPress(index)}>
                                        <Ionicons 
                                            name="star" 
                                            size={20} 
                                            color={rating >= index ? '#FFD700' : '#D9D9D9'} 
                                            style={{ margin: 2 }} 
                                        />
                                        </Pressable>
                                    ))}
                                    </View> */}
                                    <Pressable
                                        style={({ pressed }) => [
                                            {
                                                paddingVertical: 10,
                                                backgroundColor: '#FF6B00',
                                                width: '50%',
                                                alignItems: 'center',
                                                marginTop: 15,
                                                marginBottom: '10%',
                                                transform: [
                                                    { scale: pressed ? 0.95 : 1 }  // Scale down by 5% when pressed
                                                ]
                                            }
                                        ]}
                                        onPress={handlePress}
                                    >
                                        <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>Close</Text>
                                    </Pressable>
                        </View>

                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        backgroundColor: '#FBD3A8',
        borderRadius: 5,
        alignItems: 'center',
        elevation: 5,
        width:'90%'
    },
    modalText: {
        marginTop:5,
        textAlign: 'center',
        fontSize: 12,
        fontWeight:'700'
    },

    closeButtonText: {
        color: 'black',
        fontSize: 13,

    },
    payment:{
        marginTop:'10%',
        height:100,
        width:100,
        resizeMode: "contain",
    },
    profile:{
        width:40,
        height:40,
        borderRadius:100,
        alignSelf:'center'
        
    },
});

export default ConfirmPassengerSuccess;
