import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { createPassenger } from '../services/apiService'; // Adjust the path based on your project structure

const PassengerForm = () => {
  const [name, setName] = useState('');
  const [CID, setCID] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');

  const handleRegister = async () => {
    const newPassenger = {
      name,
      CID,
      gender,
      mobileNumber,
      emergencyContactNumber,
    };

    try {
      const createdPassenger = await createPassenger(newPassenger);
      console.log('Passenger registered:', createdPassenger);

      // Optionally, you can reset the form fields after registration
      setName('');
      setCID('');
      setGender('');
      setMobileNumber('');
      setEmergencyContactNumber('');
    } catch (error) {
      // Handle registration error (e.g., show an error message to the user)
      console.error('Error registering passenger:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="CID"
        value={CID}
        onChangeText={setCID}
      />
      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
      />
      <TextInput
        placeholder="Emergency Contact Number"
        value={emergencyContactNumber}
        onChangeText={setEmergencyContactNumber}
      />
      <Button
        title="Register Passenger"
        onPress={handleRegister}
      />
    </View>
  );
};

export default PassengerForm;
