import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverHome from './homeTab';
import DriverAccount from './accountTab';
import DriverContact from './contactTab';
import DriverRide from './myRideTab';
import SelectLocal from './selectLocal';
import Payment from './payment';
import Cash from './cash';
import QR from './qr';
import SelectedLD from './selectLongDis';
import D_CurrentRideDetails from './currentRideDetails';
import D_PastRideDetails from './pastRideDetails';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
    return (
        <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="driverHome" component={DriverHome} /> 
        <Stack.Screen name="selectlocal" component={SelectLocal} /> 
        <Stack.Screen name="payment" component={Payment} /> 
        <Stack.Screen name="payment_cash" component={Cash} /> 
        <Stack.Screen name="payment_qr" component={QR} /> 
        <Stack.Screen name="select_ld" component={SelectedLD} />
    </Stack.Navigator>
    );
}
function Account() {
    return (
        <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="driverAccount" component={DriverAccount} /> 
    </Stack.Navigator>
    );
}
function MyRide() {
    return (
        <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dmyRide" component={DriverRide} /> 
        <Stack.Screen name="cRide" component={D_CurrentRideDetails} /> 
        <Stack.Screen name="pRide" component={D_PastRideDetails} /> 
        <Stack.Screen name="pment" component={Payment} /> 
        <Stack.Screen name="pay_cash" component={Cash} /> 
        <Stack.Screen name="pay_qr" component={QR} /> 
    </Stack.Navigator>
    );
}
function Contact() {
    return (
        <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="contact" component={DriverContact} /> 
    </Stack.Navigator>
    );
}

export default function DriverTabNavigator() {
    return (
        <Tab.Navigator 
        screenOptions={{
            headerShown: false,
            tabBarIcon: () => null, // this will remove the icons
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            tabBarInactiveBackgroundColor:'#2D2D2D',
            tabBarActiveBackgroundColor:'#0F992E',
            tabBarStyle: [
            {
                ...Platform.select({
                    ios: {
                      height: 75,  // height for iOS
                    },
                    android: {
                      height: 45,  // height for Android
                    },
                }),
            },
            ],
            tabBarLabelStyle: {
                fontSize: 11, // change the font size
                fontWeight:400,
                marginBottom:"15%"
            },
            tabBarLabelPosition:"below-icon",

        }}>
            <Tab.Screen  
                name="Home" component={Home}
            />
            <Tab.Screen 
                name="Account" component={Account} 
            />
            <Tab.Screen 
                name="My Ride" component={MyRide} 
                options={{
                    tabBarBadge: '9', // Or any value you want to display as a badge
                    tabBarBadgeStyle: {
                        color:'white',
                        fontSize:10,
                        backgroundColor: '#FF6B00',   // Set badge background color

                    }
                }}
            />
            <Tab.Screen 
                name="Contact"  component={Contact} 

            />
        </Tab.Navigator>
    );
}