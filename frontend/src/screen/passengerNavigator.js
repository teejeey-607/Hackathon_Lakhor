

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './passenger/AuthContext';
import Passenger from './passenger/passenger';
import Register from './passenger/P_registration';
import Login from './passenger/P_login';
import OTP from './passenger/P_otp';
import PassengerTabNavigator from './passenger/passengerTabNavigator';
import PassengerSettings from './passenger/settings';
import { AuthProvider } from './passenger/AuthContext';
// import MapScreen from './passenger/Map';
// import MapPage from './passenger/Map';
import MapPage from './passenger/Map';
import LocationDisabledPage from './passenger/LocationDisabledPage';
import ConfirmDriver from './passenger/confirmDriver';

const Stack = createNativeStackNavigator();

function PassengerNavigator() {
  
  return (
 
      <AuthProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="PassengerHome" component={Passenger} />
          <Stack.Screen name="PassengerRegistration" component={Register} />
          <Stack.Screen name="P_Login" component={Login} />
          <Stack.Screen name="P_OTP" component={OTP} />
          <Stack.Screen name="PassengerTab" component={PassengerTabNavigator} />
          <Stack.Screen name="P_Settings" component={PassengerSettings} />
          <Stack.Screen name="MapPage" component={MapPage} />
          <Stack.Screen name="LocationDisabledPage" component={LocationDisabledPage} />
          <Stack.Screen name="ConfirmDriver" component={ConfirmDriver} />
        </Stack.Navigator>
      </AuthProvider>
    
  );
}

export default PassengerNavigator;
