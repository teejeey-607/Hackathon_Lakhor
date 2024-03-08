import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,StatusBar,Pressable,Image,Dimensions,Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo and have installed the Ionicons library
import SuccessAlert from './SuccessAlert';
import { useState } from 'react';

const { width } = Dimensions.get('window');
export default function Cash({ navigation, route }) {

    const { user_cid, pickup, destination, fare} = route.params;
    
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');

    const [showAlert, setShowAlert] = useState(false);

return (
    <View style={styles.container}>
        <View style={{alignItems:'center'}}>
        <Image style={styles.payment} source={require('../../../assets/image/cash.png')} />
        </View>

    <View style={{flexDirection:'row',paddingHorizontal:'15%',marginTop:'5%'}}>

    </View>
    <View style={{paddingHorizontal:'15%',marginTop:'4%',alignItems:'center'}}>
        <Text style={{fontSize:13,fontWeight:500}}>You have reached your destination!</Text>

    </View>
    <View style={{paddingHorizontal:'10%',paddingVertical:'5%',backgroundColor:'#D9D9D9',marginTop:'10%'}}>
    <View style={{flexDirection:'row'}}>
                <View style={{width:'50%'}}>
                    <Text style={{fontSize:12,fontWeight:600}}>From:</Text>
                    <Text style={{fontSize:11}}>{pickup}</Text>

                    <Text style={{fontSize:12,fontWeight:600,marginTop:'5%'}}>To</Text>
                    <Text style={{fontSize:11}}>{destination}</Text>
                </View>
                <View style={{width:'40%',justifyContent:'flex-end'}}>
                <Text style={{fontSize:14,fontWeight:600}}>Nu.{fare}</Text>
                </View>
                </View>
    </View>
    <View style={{paddingHorizontal:'10%',marginTop:'5%',width:'100%'}}>
        <View style={{width:'50%',backgroundColor:'white',flexDirection:'row'}}>
            <View style={{width:'40%'}}>
            <Text style={{fontSize:18,fontWeight:500}}>CASH </Text>
            </View>
            <View style={{width:'50%',alignItems:'flex-end',justifyContent:'flex-end'}}>
            <Text style={{fontSize:12,fontWeight:500}}>  Received:</Text>
            </View> 
        </View>
        <View style={{flexDirection:'row',marginTop:'5%'}}>
            <View style={{width:'48%',alignItems:'center',justifyContent:'center',backgroundColor:'#D9D9D9',borderRadius:15,marginRight:'2%'}}>
                <Text style={{fontSize:24,fontWeight:500}}>Nu.{fare}</Text>
            </View>
            <View style={{width:'48%',marginLeft:'2%'}}>
            <Pressable 
                onPress={() => setShowAlert(true)}
                style={({ pressed }) => [
                    styles.btn,
                    {
                        backgroundColor: '#0F992E',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        transform: [{ scale: pressed ? 0.95 : 1 }] // Reduce the size on press
                    },
                ]}
            >
                <Text style={{ fontSize: 12, fontWeight: 400, color: 'white' }}>Confirm</Text>
            </Pressable>

            <Pressable 
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [
                    styles.btn,
                    {
                        backgroundColor: '#2E3E31',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        marginTop: '5%',
                        transform: [{ scale: pressed ? 0.95 : 1 }] // Reduce the size on press
                    },
                ]}
            >
                <Text style={{ fontSize: 12, fontWeight: 400, color: 'white' }}>Cancel</Text>
            </Pressable>
            <SuccessAlert 
                visible={showAlert} 
                message="You have completed the transaction" 
                navigation={navigation}
            />
            </View>
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

payment:{
    width:width/1.15,
    height:width/1.15,
    marginTop:'11%'
    
},
btn: {
    alignItems: 'center',
    paddingVertical: "7%"

  },

});


// import React from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   StatusBar,
//   Pressable,
//   Image,
//   Dimensions,
// } from "react-native";
// import SuccessAlert from "./SuccessAlert";
// import { useState, useEffect } from "react";
// import { useRoute } from "@react-navigation/native";

// const { width } = Dimensions.get("window");
// export default function Cash({ navigation }) {
//   StatusBar.setBackgroundColor("transparent");
//   StatusBar.setBarStyle("dark-content");

//   const [showAlert, setShowAlert] = useState(false);

//   const route = useRoute();
//   const handleSubmit = () => {
//     // Check the current screen name and navigate accordingly
//     if (route.name === "payment_cash") {
//       navigation.navigate("driverHome");
//     } else if (route.name === "pay_cash") {
//       navigation.navigate("dmyRide");
//     }
//   };
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowAlert(false);
//       handleSubmit();
//     }, 5000); // 5 seconds in milliseconds

//     // Clear the timer if the component is unmounted before 5 seconds
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={{ alignItems: "center" }}>
//         <Image
//           style={styles.payment}
//           source={require("../../../assets/image/cash.png")}
//         />
//       </View>

//       <View
//         style={{
//           flexDirection: "row",
//           paddingHorizontal: "15%",
//           marginTop: "5%",
//         }}
//       ></View>
//       <View
//         style={{
//           paddingHorizontal: "15%",
//           marginTop: "4%",
//           alignItems: "center",
//         }}
//       >
//         <Text style={{ fontSize: 13, fontWeight: 500 }}>
//           You have reached your destination!
//         </Text>
//       </View>
//       <View
//         style={{
//           paddingHorizontal: "10%",
//           paddingVertical: "5%",
//           backgroundColor: "#D9D9D9",
//           marginTop: "10%",
//         }}
//       >
//         <View style={{ flexDirection: "row" }}>
//           <View style={{ width: "50%" }}>
//             <Text style={{ fontSize: 12, fontWeight: 600 }}>From:</Text>
//             <Text style={{ fontSize: 11 }}>Clock Tower, Thimphu</Text>

//             <Text style={{ fontSize: 12, fontWeight: 600, marginTop: "5%" }}>
//               To
//             </Text>
//             <Text style={{ fontSize: 11 }}>Kabesa GCIT</Text>
//           </View>
//           <View style={{ width: "40%", justifyContent: "flex-end" }}>
//             <Text style={{ fontSize: 14, fontWeight: 600 }}>Nu.400</Text>
//           </View>
//         </View>
//       </View>
//       <View
//         style={{ paddingHorizontal: "10%", marginTop: "5%", width: "100%" }}
//       >
//         <View
//           style={{
//             width: "50%",
//             backgroundColor: "white",
//             flexDirection: "row",
//           }}
//         >
//           <View style={{ width: "40%" }}>
//             <Text style={{ fontSize: 18, fontWeight: 500 }}>CASH </Text>
//           </View>
//           <View
//             style={{
//               width: "50%",
//               alignItems: "flex-end",
//               justifyContent: "flex-end",
//             }}
//           >
//             <Text style={{ fontSize: 12, fontWeight: 500 }}> Received:</Text>
//           </View>
//         </View>
//         <View style={{ flexDirection: "row", marginTop: "5%" }}>
//           <View
//             style={{
//               width: "48%",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundColor: "#D9D9D9",
//               borderRadius: 15,
//               marginRight: "2%",
//             }}
//           >
//             <Text style={{ fontSize: 24, fontWeight: 500 }}>Nu.400</Text>
//           </View>
//           <View style={{ width: "48%", marginLeft: "2%" }}>
//             <Pressable
//               onPress={() => setShowAlert(true)}
//               style={({ pressed }) => [
//                 styles.btn,
//                 {
//                   backgroundColor: "#0F992E",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   width: "100%",
//                   transform: [{ scale: pressed ? 0.95 : 1 }], // Reduce the size on press
//                 },
//               ]}
//             >
//               <Text style={{ fontSize: 12, fontWeight: 400, color: "white" }}>
//                 Confirm
//               </Text>
//             </Pressable>

//             <Pressable
//               onPress={() => navigation.goBack()}
//               style={({ pressed }) => [
//                 styles.btn,
//                 {
//                   backgroundColor: "#2E3E31",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   width: "100%",
//                   marginTop: "5%",
//                   transform: [{ scale: pressed ? 0.95 : 1 }], // Reduce the size on press
//                 },
//               ]}
//             >
//               <Text style={{ fontSize: 12, fontWeight: 400, color: "white" }}>
//                 Cancel
//               </Text>
//             </Pressable>
//             <SuccessAlert
//               visible={showAlert}
//               message="You have completed the transaction"
//               navigation={navigation}
//             />
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },

//   payment: {
//     width: width / 1.15,
//     height: width / 1.15,
//     marginTop: "11%",
//   },
//   btn: {
//     alignItems: "center",
//     paddingVertical: "7%",
//   },
// });
