import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PassengerAccount from './accountTab';
import PassengerContact from './contactTab';
import PassengerHome from './homeTab';
import PassengerRide from './myRideTab';
import LocalPickUp from './localPickUp';
import ChooseDriver from './chooseDriver';
import ConfirmDriver from './confirmDriver';
import CancelOption from './cancelOptions';
import Payment from './payment';
import ConfirmDriverLongDistance from './longDisConfirmDriver';
import CurrentRideDetails from './currentRideDetails';
import PastRideDetails from './pastRideDetails';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
    return (
        <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="passengerHome" component={PassengerHome} />
        <Stack.Screen name="localpickup" component={LocalPickUp} />
        <Stack.Screen name="chooseDriver" component={ChooseDriver} />
        <Stack.Screen name="confirmDriver" component={ConfirmDriver} />
        <Stack.Screen name="cancelOption" component={CancelOption} />
        <Stack.Screen name="payment" component={Payment} />
        <Stack.Screen name="CD_LD" component={ConfirmDriverLongDistance} />
    </Stack.Navigator>
    );
}
function Account() {
    return (
        <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="passengerAccount" component={PassengerAccount} /> 
    </Stack.Navigator>
    );
}
function MyRide() {
    return (
        <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="myRide" component={PassengerRide} /> 
        <Stack.Screen name="currentRideDetails" component={CurrentRideDetails} />
        <Stack.Screen name="pastRideDetails" component={PastRideDetails} />
        <Stack.Screen name="cancelOpt" component={CancelOption} />
        <Stack.Screen name="pay" component={Payment} />

        
    </Stack.Navigator>
    );
}
function Contact() {
    return (
        <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="contact" component={PassengerContact} /> 
    </Stack.Navigator>
    );
}

export default function PassengerTabNavigator() {
    return (
        <Tab.Navigator 
        screenOptions={{
            headerShown: false,
            tabBarIcon: () => null, // this will remove the icons
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            tabBarInactiveBackgroundColor:'#2D2D2D',
            tabBarActiveBackgroundColor:'#FF6B00',
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