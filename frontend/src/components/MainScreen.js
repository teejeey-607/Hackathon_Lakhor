import React, { useEffect } from 'react';
import { View, Text, Button, Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Handle deep linking
    const handleDeepLink = (event) => {
        const { url } = event;
        console.log('Received URL:', url);
      
        // Handle the deep link URL as needed
        if (url.includes('instagram')) {
          // Handle the return from the Instagram app
          // Log this step to see if it's being executed
          console.log('Navigating to Success');
          navigation.navigate('Success');
        }
      };
      

    // Subscribe to deep linking events
    Linking.addEventListener('url', handleDeepLink);

    // Clean up the event listener when the component unmounts
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, [navigation]);

  const handlePaymentButtonPress = () => {
    const instagramDeepLink = 'instagram://user?username=instagram';

    Linking.canOpenURL(instagramDeepLink)
      .then((supported) => {
        if (supported) {
          Linking.openURL(instagramDeepLink);
        } else {
          console.error('Instagram app is not installed.');
        }
      })
      .catch((error) => console.error('Error opening deep link:', error));
  };

  const handle = () => {
    // Navigate to the "Success" screen
    navigation.navigate('Success');
  };


  return (
    <View style={styles.container}>
      <Text>Your App Content Goes Here</Text>
      <View style={styles.buttonContainer}>
        <Button title="Go to Instagram" onPress={handlePaymentButtonPress} />
        <Text></Text>
        <Button title="Success" onPress={handle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default MainScreen;
