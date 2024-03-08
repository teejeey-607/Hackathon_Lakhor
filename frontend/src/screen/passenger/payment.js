import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,StatusBar,Pressable,ScrollView,Image,Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo and have installed the Ionicons library
import { useState } from 'react';
import ConfirmPassengerSuccess from './successCP';


const { width } = Dimensions.get('window');

export default function Payment({ navigation }) {
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');

      // onPress Button
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleSubmitPressIn = () => {
    setSubmitPressed(true);
  };

  const handleSubmitPressOut = () => {
    setSubmitPressed(false);
  };


  const [showAlert, setShowAlert] = useState(false);
return (
    <View style={styles.container}>
    <View style={{justifyContent: 'center',alignItems: 'center',height:'60%',backgroundColor:'#D9D9D9'}}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#969696" />
        </TouchableOpacity>
        <Text>Payment</Text>
        </View>

    <View>
        <View style={{backgroundColor:'#FF6B00',paddingHorizontal:'8%',paddingVertical:'2%',justifyContent:'center'}}>
            <View style={{flexDirection:'row'}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={{color:'white',fontSize:12,fontWeight:500}}>Payment</Text>
                </View>
            </View>
            
        </View>
        <View style={{paddingHorizontal:'8%',height:'57%'}}>
            <ScrollView>
            <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>I would like to pay with:</Text>
            <View style={{flexDirection:'row',marginTop:10}}>
                <View style={{width:'48%',alignItems:'flex-end'}}>
                    {/* row 1 */}
                    <View style={{flexDirection:'row'}}>
                        <Pressable style={({ pressed }) => [
                            { ...styles.logoContainer, marginRight: 0.5, padding: pressed ? 8 : 10 }
                            ]}>
                            <Image style={styles.banklogo} source={require('../../../assets/image/banks/bob.png')}/>
                        </Pressable>
                        <Pressable style={({ pressed }) => [
                            { ...styles.logoContainer, marginLeft: 0.5, padding: pressed ? 8 : 13 }
                            ]}>
                            <Image style={styles.banklogo} source={require('../../../assets/image/banks/bnb.png')}/>
                        </Pressable>
                    </View>
                    {/* row 2 */}
                    <View style={{flexDirection:'row'}}>
                        <Pressable style={({ pressed }) => [
                            { ...styles.logoContainer, marginRight: 0.5, padding: pressed ? 6 : 13 }
                            ]}>
                            <Image style={styles.banklogo} source={require('../../../assets/image/banks/pnb.png')}/>
                        </Pressable>
                        <Pressable style={({ pressed }) => [
                            { ...styles.logoContainer, marginLeft: 0.5, padding: pressed ? 8 : 10 }
                            ]}>
                            <Image style={styles.banklogo} source={require('../../../assets/image/banks/tb.png')}/>
                        </Pressable>
                    </View>
                    {/* row 3 */}
                    <View style={{flexDirection:'row'}}>
                        <Pressable style={({ pressed }) => [
                            { ...styles.logoContainer, marginRight: 0.5, padding: pressed ? 8 : 10 }
                            ]}>
                            <Image style={styles.banklogo} source={require('../../../assets/image/banks/bdbl.png')}/>
                        </Pressable>
                        <Pressable style={({ pressed }) => [
                            { ...styles.logoContainer, marginLeft: 0.5, padding: pressed ? 8 : 10 }
                            ]}>
                            <Image style={styles.banklogo} source={require('../../../assets/image/banks/dk.png')}/>
                        </Pressable>
                    </View>
                </View>
                <View  style={{width:'27%', alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:14,fontWeight:'bold'}}>OR</Text>
                </View>
                <Pressable
                    style={({pressed})=>[
                        {
                            width:'25%',
                            justifyContent:'center',
                            backgroundColor: pressed ? '#F76901': '#FF6B00'
                        }
                        
                    ]}
                    onPress={() => setShowAlert(true)}
                    >
                    <View style={{alignItems:'center'}}>
                        <Text style={{color:'white',fontSize:26,fontWeight:'bold'}}>NU</Text>
                        <Text style={{color:'white',fontSize:12,fontWeight:'bold'}}>CASH</Text>
                    </View>
                </Pressable>
            </View>
            <View>

            </View>
            </ScrollView>
        </View>
    </View>
    <ConfirmPassengerSuccess
                visible={showAlert} 
                navigation={navigation}
            />
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
    width: "50%",
    alignItems: 'center',
    paddingVertical: "4%"

},
    profile:{
    width:40,
    height:40,
    borderRadius:100,
    
},
banklogo:{
    resizeMode:'contain',
    width:'100%',
    height:50
},
logoContainer:{
    width:width/5,
    height:width/5,
    borderWidth:0.5,
    borderColor:'#D9D9D9',
    alignItems:'center',
    justifyContent:'center',
    marginTop:1

}
});
