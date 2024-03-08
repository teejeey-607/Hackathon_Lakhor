// Import necessary modules
import * as SecureStore from 'expo-secure-store';

// Function to check if the user is registered
const isUserRegistered = async () => {
  try {
    // Check if certain data is stored in SecureStore (e.g., user token, registration data, etc.)
    const storedData = await SecureStore.getItemAsync('formData');

    // If data is found, consider the user registered
    return !!storedData;
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false; // Return false in case of an error or no data found
  }
};

export default isUserRegistered;
