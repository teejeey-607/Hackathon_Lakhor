import * as React from 'react';
import { View, Text ,StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/home';
import PassengerNavigator from './src/screen/passengerNavigator';
import DriverNavigator from './src/screen/driverNavigator';


const Stack = createNativeStackNavigator();

function App() {
  StatusBar.setBackgroundColor('#ffff');
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Passenger" component={PassengerNavigator}/>
        <Stack.Screen name="Driver" component={DriverNavigator}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;