// import * as React from 'react';
// import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import {createNativeStackNavigator } from '@react-navigation/native-stack';
// import Register from './driver/D_registration';
// import Driver from './driver/driver';
// import Login from './driver/D_login';
// import OTP from './driver/D_otp';
// import DriverTabNavigator from './driver/driverTabNavigator';
// import DriverSettings from './driver/settings';

// const Stack = createNativeStackNavigator();

// function DriverNavigator() {
//   return (
//       <Stack.Navigator
//       screenOptions={{ headerShown: false }} 
//       >
//         <Stack.Screen name="DriverHome" component={Driver} />
//         <Stack.Screen name="DriverRegistration" component={Register} />
//         <Stack.Screen name="D_Login" component={Login} />
//         <Stack.Screen name="D_OTP" component={OTP} />
//         <Stack.Screen name="DriverTab" component={DriverTabNavigator}/>
//         <Stack.Screen name="D_Settings" component={DriverSettings} />
//       </Stack.Navigator>
      

//   );
// }

// export default DriverNavigator;

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './driver/D_registration';
import Driver from './driver/driver';
import Login from './driver/D_login';
import OTP from './driver/D_otp';
import DriverTabNavigator from './driver/driverTabNavigator';
import DriverSettings from './driver/settings';
import { AuthProvider } from './driver/DriverAuthContext';
import LocationDisabledPage from './driver/LocationDisabledPage '

const Stack = createNativeStackNavigator();

function DriverNavigator() {
  return (
    <AuthProvider>
   
      <Stack.Navigator
      screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="DriverHome" component={Driver} />
        <Stack.Screen name="DriverRegistration" component={Register} />
        <Stack.Screen name="D_Login" component={Login} />
        <Stack.Screen name="D_OTP" component={OTP} />
        <Stack.Screen name="DriverTab" component={DriverTabNavigator}/>
        <Stack.Screen name="D_Settings" component={DriverSettings}/>
        <Stack.Screen name="LocationDisabledPage" component={LocationDisabledPage }/>
      </Stack.Navigator>
      </AuthProvider>
      

  );
}

export default DriverNavigator;