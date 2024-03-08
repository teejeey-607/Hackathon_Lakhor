import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ImageBackground, Dimensions, RefreshControl, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from './DriverAuthContext';

export default function DriverAccount({navigate}) {
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();

  const {driverlogout} = useAuth();

  const [settingsPressed, setSettingsPressed] = useState(false);
  const [logoutPressed, setLogoutPressed] = useState(false);
  const [userData, setUserData] = useState({
    // userId: '',
    name:'',
    cid:'',
    licencenumber:'',
    gender:'',
    mobilenumber:'',
    vehiclenumber:'',
    vehiclebrand:'',
    vehiclecolor:'',
    vehicletype:'',
    vehiclecapacity:'',
    bankaccount:'',
    accountnumber:''
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRegisteredData();
  };

  const handleSettingsPressIn = () => {
    setSettingsPressed(true);
  };

  const handleSettingsPressOut = () => {
    setSettingsPressed(false);
  };

  const handleLogoutPressIn = () => {
    setLogoutPressed(true);
  };

  const handleLogoutPressOut = () => {
    setLogoutPressed(false);
  };

  const fetchRegisteredData = async () => {
    try {
      const registeredDataString = await SecureStore.getItemAsync('formData');
      if (registeredDataString) {
        const formData = JSON.parse(registeredDataString);

        // console.log('driver Registered Data:', formData);
      setUserData({
        // userId: formData.userId,
        name: formData.name,
        cid: formData.cid,
        licencenumber: formData.licencenumber,
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
    }
      
    } catch (error) {
      console.error('Error fetching registered data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegisteredData();
  }, []);

  console.log('driveruserdata:', userData);

  const handleSettingsPress = () => {
    navigation.navigate('D_Settings', { userData });
  };

  const handleLogoutPress = () => {
    driverlogout();
    // SecureStore.deleteItemAsync('formData');
    navigation.navigate('HomeScreen');
 
  };

  return (
  
<ScrollView
      style={{ flex: 1, backgroundColor: 'white' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ImageBackground
        source={require('../../../assets/image/deleteItLater.jpg')}
        style={{ height:400, alignItems: 'center', width: width }}
      >
        <LinearGradient
          colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '100%' }}
        />
      </ImageBackground>

      {/* user info */}
      <View style={{ width: width / 1.3, backgroundColor: 'white', borderRadius: 5, top: '-8%', alignSelf: 'center', borderWidth: 1, borderColor: '#D9D9D9', alignItems: 'center' }}>
        <View style={{ paddingVertical: '6%', width: '100%', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name="md-person" size={22} color="#535353" style={{ paddingRight: '6%' }} />
            <View style={{justifyContent:'center'}}>
            <Text style={{ fontSize: 13, fontWeight: 500, color: '#535353' }}>{userData.name}</Text>
            </View>
          </View>
        </View>
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#939598', width: '85%', alignItems: 'center' }}></View>
        <View style={{ paddingVertical: '6%', width: '100%', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name="md-call" size={22} color="#535353" style={{ paddingRight: '6%' }} />
            <View style={{justifyContent:'center'}}>
            <Text style={{ fontSize: 13, fontWeight: 500, color: '#535353' }}>+975{userData.mobilenumber}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Edit and log out*/}
      <View style={{ width: width / 1.3, backgroundColor: 'white', borderRadius: 5, alignSelf: 'center', top: '-5%', borderWidth: 1, borderColor: '#D9D9D9', alignItems: 'center' }}>
        <Pressable
          onPressIn={handleSettingsPressIn}
          onPressOut={handleSettingsPressOut}
          onPress={handleSettingsPress}
          style={({ pressed }) => [
            { paddingVertical: '6%', width: '100%', alignItems: 'center', backgroundColor: pressed ? 'rgba(0,0,0,0.1)' : 'transparent' },
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name="md-settings" size={22} color="#535353" style={{ paddingRight: '6%' }} />
            <View style={{justifyContent:'center'}}>
            <Text style={{ fontSize: 13, fontWeight: '500', color: '#535353' }}>Settings</Text>
          </View>
          </View>
        </Pressable>
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#939598', width: '85%', alignItems: 'center' }}></View>
        <Pressable
          onPressIn={handleLogoutPressIn}
          onPressOut={handleLogoutPressOut}
          onPress={handleLogoutPress}
          style={({ pressed }) => [
            { paddingVertical: '6%', width: '100%', alignItems: 'center', backgroundColor: pressed ? 'rgba(0,0,0,0.1)' : 'transparent' },
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name="md-log-out" size={22} color="#535353" style={{ paddingRight: '6%' }} />
            <View style={{justifyContent:'center'}}>
            <Text style={{ fontSize: 13, fontWeight: '500', color: '#535353' }}>Log Out</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </ScrollView>    
  );
}


