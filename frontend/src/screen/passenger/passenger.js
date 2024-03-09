import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import isUserRegistered from './isUserRegistered';
import { useAuth } from './AuthContext';

export default function Passenger({ navigation }) {
  const { user } = useAuth();
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [registerPressed, setRegisterPressed] = useState(false);

  const handleRegisterPressIn = () => {
    setRegisterPressed(true);
  };

  const handleRegisterPressOut = () => {
    setRegisterPressed(false);
  };

  useEffect(() => {
    const checkUserRegistration = async () => {
      const userRegistered = await isUserRegistered();
      setShowLoginButton(userRegistered);
    };

    checkUserRegistration();

    // Check if the user is already logged in
    if (user) {
      // Redirect to 'PassengerTab' only if the user is logged in
      navigation.replace('PassengerTab');
    }
  }, [user]);

  const registerButtonStyle = {
    ...styles.btn,
    backgroundColor: '#2D2D2D',
    marginTop: registerPressed ? '5.5%' : '5%',
    transform: [{ scale: registerPressed ? 0.95 : 1 }],
  };
  const loginButtonStyle = {
    ...styles.btn,
    backgroundColor: '#FF6B00',
    marginTop: showLoginButton ? '5%' : '0%', // Adjust marginTop based on whether login button should be visible
    transform: [{ scale: showLoginButton ? 1 : 0 }], // Use scale to hide/show the button
  };

  return (
    <View style={styles.mainContainer}>
      <Image style={styles.dragon} source={require('../../../assets/image/bg.png')} />
      <Image style={styles.welcome} source={require('../../../assets/image/passenger.png')} />
      <Text style={styles.text}>Welcome to</Text>
      <Image style={styles.logo} source={require('../../../assets/image/logo.png')} />
      <View style={styles.role}>
        {!user && showLoginButton && (
          <Pressable
            style={loginButtonStyle}
            onPress={() => navigation.navigate('P_Login')}
            onPressIn={handleRegisterPressIn}
            onPressOut={handleRegisterPressOut}
          >
            <View style={styles.center}>
              <Text style={{ color: 'white', fontWeight: '600' }}>LOGIN</Text>
            </View>
          </Pressable>
        )}
          <Pressable
            style={registerButtonStyle}
            onPress={() => navigation.navigate('PassengerRegistration')}
            onPressIn={handleRegisterPressIn}
            onPressOut={handleRegisterPressOut}
          >
            <View style={styles.center}>
              <Text style={{ color: 'white', fontWeight: '600' }}>REGISTER</Text>
            </View>
          </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dragon: {
    marginTop: '20%',
    width: '90%',
    resizeMode: 'contain',
  },
  welcome: {
    position: 'absolute',
    marginTop: '36%',
    width: '32%',
    resizeMode: 'contain',
  },
  logo: {
    marginTop: '5%',
    width: '55%',
    resizeMode: 'contain',
    height: '10%',
  },
  text: {
    marginTop: '10%',
    fontWeight: '800',
    fontSize: 18,
  },
  role: {
    paddingHorizontal: '10%',
    width: '100%',
    marginTop: '5%',
    color: 'white',
  },
  btn: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
    padding: '5%',
  },
  center: {
    alignItems: 'center',
  },
});
