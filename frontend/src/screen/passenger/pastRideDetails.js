import React from 'react';
import { StyleSheet, Text, View, StatusBar, Pressable,FlatList,TouchableOpacity,Image,Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PastRideDetails({navigation}) {
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');

    return(
<View style={styles.container}>
    <View style={styles.header}>
        <View style={{ flexDirection: 'row' }}>
        <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FF6B00" />
            </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'center' }}>
            <Text style={{ color: '#535353', fontSize: 15, fontWeight: '600', paddingLeft: 10 }}>
            Ride  Details
            </Text>
        </View>
        </View>
    </View>
    {/* content */}
    <View style={{marginTop:10}}>
    {/* ride info */}
    <View >
        <View style={{backgroundColor:'#F4F4F4',paddingVertical:12,borderWidth:0.5, borderColor:'#D9D9D9'}}>
            <Text style={{fontSize:14,fontWeight:600,color:'#6F6F6F',paddingHorizontal:'8%'}}>Ride Info</Text>
        </View>
        <View style={{ marginHorizontal: '8%', paddingVertical: 13,  borderRadius: 5, marginBottom: 5,marginTop:12 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ height: 15, width: 15, backgroundColor: '#D9D9D9', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ height: 8, width: 8, backgroundColor: '#878787', borderRadius: 100 }}></View>
            </View>
          </View>
          <View style={{ width: '88%', paddingLeft: '5%' }}>
            <Text style={{ fontSize: 10, fontWeight: 700 }}>Clock Tower, Behind ZamZam Restaurantttttttttt</Text>
            <Text style={{ fontSize: 10, color: '#6D6D6D',marginTop:5 }}>Pickup Location</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginTop: '10%' }}>
          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="location" size={18} color="red" style={{ marginTop: '5%' }} />
          </View>
          <View style={{ width: '88%', paddingLeft: '5%' }}>
            <Text style={{ fontSize: 10, fontWeight: 700 }}>Clock Tower, Zam Zam estaurant</Text>
            <Text style={{ fontSize: 10, color: '#6D6D6D',marginTop:5 }}>Destination Location</Text>
          </View>
        </View>
      </View>
    </View>
    {/* driver info */}
    <View style={{paddingVertical:5}}>
        <View style={{backgroundColor:'#F4F4F4',paddingVertical:12,borderWidth:0.5, borderColor:'#D9D9D9'}}>
            <Text style={{fontSize:14,fontWeight:600,color:'#6F6F6F',paddingHorizontal:'8%'}}>Driver Info</Text>
        </View>
        <View style={{flexDirection:'row',paddingHorizontal:'8%',paddingVertical:'8%'}}>
                            <View style={{width:'45%'}}>
                            <Image style={styles.profile} source={require('../../../assets/image/deleteItLater.jpg')} />
                            <Text style={{fontWeight:500,fontSize:12,color:'#626262'}}>Sonam Wangyel</Text>
                            <View style={{flexDirection:'row'}}>
                            <Ionicons name="star" size={12} color="#626262" style={{ padding: 1 }} />
                            <Ionicons name="star" size={12} color="#626262" style={{ padding: 1 }} />
                            <Ionicons name="star" size={12} color="#626262" style={{ padding: 1 }} />
                            <Ionicons name="star" size={12} color="#626262" style={{ padding: 1 }} />
                            <Ionicons name="star-outline" size={12} color="#626262" style={{ padding: 1 }} />
                            </View>
                            </View>
                            <View style={{justifyContent:'center',width:'45%'}}>
                            <Text style={{fontSize:10,color:'#626262',fontWeight:500}}>Car Details</Text>
                            <Text style={{fontSize:14,fontWeight:500,color:'#626262'}}>BP-1-B7330 </Text>
                            <Text style={{fontSize:10,color:'#626262'}}>WagonR - White</Text>
                            </View>
                            <View style={{justifyContent:'center',alignItems:'flex-end',width:'10%'}}>
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
                                transform: [{ scale: pressed ? 0.95 : 1 }]
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
                                transform: [{ scale: pressed ? 0.95 : 1 }]
                                })}
                            >
                                <Ionicons name="logo-whatsapp" size={20} color="black" />
                            </Pressable>
                            </View>
                        </View>
    </View>
    {/* payment info */}
    <View>
    <View style={{backgroundColor:'#F4F4F4',paddingVertical:12,borderWidth:0.5, borderColor:'#D9D9D9'}}>
            <Text style={{fontSize:14,fontWeight:600,color:'#6F6F6F',paddingHorizontal:'8%'}}>Payment Info</Text>
        </View>
    <View style={{marginHorizontal:'8%'}}>
        <View style={{flexDirection:'row',marginTop:10}}>
            <View style={{width:'50%'}}>
                <Text style={{color:'#8C8C8C',fontWeight:500,fontSize:14}}>Payment Type</Text>
                <Text style={{color:'#FF6B00',fontWeight:500,fontSize:14}}>CASH</Text>
            </View>
            <View style={{width:'50%',alignItems:'flex-end'}}>
            <Text style={{color:'#8C8C8C',fontWeight:500,fontSize:14}}>Total Cost</Text>
                <Text style={{color:'#FF6B00',fontWeight:500,fontSize:14}}>Nu. 400</Text>
            </View>
        </View>
    </View>
    </View>
    </View>
</View>
    )}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginTop: 40,
    paddingHorizontal: '8%',
  },
  profile:{
    width:40,
    height:40,
    borderRadius:100,
    
},
btn: {
    width: "40%",
    alignItems: 'center',
    paddingVertical: "3%"

  },

});
