import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Image,
  Linking,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import ConfirmDriverSuccess from "./successCD.js";
import { useIsFocused, useRoute } from "@react-navigation/native";
import axios from "axios";
import config from "../../../config.js";
import * as SecureStore from "expo-secure-store";

export default function ConfirmDriverLongDistance({ navigation }) {
  StatusBar.setBackgroundColor("transparent");
  StatusBar.setBarStyle("dark-content");

  const route = useRoute();

  const { destination } = route.params;
  console.log(destination);

  const isFocused = useIsFocused(); //to rende rwhen the screen is focused

  // onPress Button
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleSubmitPressIn = () => {
    setSubmitPressed(true);
  };

  const handleSubmitPressOut = () => {
    setSubmitPressed(false);
  };

  const [showAlert, setShowAlert] = useState(false);

  //   useEffect(() => {
  //     if (showAlert) {
  //       const timer = setTimeout(() => {
  //         setShowAlert(false);
  //         navigation.navigate("cancelOption");
  //       }, 5000); // 5 seconds in milliseconds

  //       // Clear the timer if the component is unmounted before 5 seconds
  //       return () => clearTimeout(timer);
  //     }
  //   }, [showAlert, navigation]);

  const [data, setData] = useState();

  useEffect(() => {
    const fetchUserCurrentRide = async () => {
      try {
        const storedRegisteredData = await SecureStore.getItemAsync(
          "registeredData"
        );
        const user_data = JSON.parse(storedRegisteredData);
        console.log("Stored Registered Data:", user_data.userId);

        // Fetch user's current ride
        const currentRideResponse = await axios.get(
          `${config.API_URL}/api/rides-passenger-current-ride`,
          {
            params: {
              userId: user_data.userId,
            },
          }
        );

        console.log(currentRideResponse.data.currentRide);
        if (currentRideResponse.data.flag) {
          // Redirect to another screen if the user has a booked ride
          navigation.navigate("cancelOption", {
            data: currentRideResponse.data.currentRide,
          });
        } else {
          // Fetch the first ride in the queue if user doesn't have a booked ride
          try {
            // Make sure destination is defined
            if (!destination) {
              throw new Error("Destination is not defined");
            }

            const firstQueueResponse = await axios.get(
              `${config.API_URL}/api/rides-first-queue`,
              {
                params: {
                  destination: destination,
                },
              }
            );

            console.log(firstQueueResponse.data.id);
            setData(firstQueueResponse.data);
          } catch (error) {
            console.log("Error fetching first ride in the queue:", error);
            // Handle errors fetching first ride in the queue
          }
        }
      } catch (error) {
        console.log("Error fetching user's current ride:", error);
        // Handle errors fetching user's current ride
      }
    };

    fetchUserCurrentRide();
  }, [isFocused, destination]); // Assuming isFocused and destination are used to trigger the fetch again on focus change or when destination changes

  //   useEffect(() => {
  //     const fetchRides = async () => {
  //       try {
  //         const response = await axios.get(
  //           `${config.API_URL}/api/rides-first-queue`,
  //           {
  //             params: {
  //               destination: destination,
  //             },
  //           }
  //         );

  //         console.log(response.data.id);
  //         setData(response.data);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     fetchRides();
  //   }, [isFocused]);

  const [modalVisible, setModalVisible] = useState(false);

  const handleTextChange = (text) => {
    setDescription(text);
  };

  const [description, setDescription] = useState("");

  const openConfirmationAlert = () => {
    Alert.alert(
      "Ride Confirmation",
      `Do you want to book this ride? Destination: ${destination}`,
      [
        {
          text: "Yes",
          onPress: () => handleConfirm(), // Pass a function reference
          style: "destructive", // This will make the button orange
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const openConfirmationAlert2 = () => {
    Alert.alert(
      "Ride Book Successfully",
      `Destination: ${destination}`,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("cancelOption", {
                data: data,
              });
          }, // Pass a function reference
          style: "destructive", // This will make the button orange
        },
        // {
        //   text: "Cancel",
        //   style: "cancel",
        // },
      ],
      { cancelable: false }
    );
  };

  const handleConfirm = async () => {
    const storedRegisteredData = await SecureStore.getItemAsync(
      "registeredData"
    );
    const user_data = JSON.parse(storedRegisteredData);
    console.log("Stored Registered Data:", user_data.userId); // Output: 7

    console.log("hello world");
    try {
      const res = await axios.patch(`${config.API_URL}/api/ride/passenger`, {
        id: data.id, //ride id
        passenger: user_data.userId,
        description: description,
      });

      console.log(res.data);
      openConfirmationAlert2();
    } catch (error) {
      console.log(error);
    }
  };

  if (!data)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>No driver found. Searching...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "60%",
          backgroundColor: "#D9D9D9",
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#969696" />
        </TouchableOpacity>
        <Text>Long Distance Confirm Driver</Text>
      </View>

      <View>
        <View
          style={{
            backgroundColor: "#FF6B00",
            paddingHorizontal: "8%",
            paddingVertical: "2%",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ justifyContent: "center" }}>
              <Text style={{ color: "white", fontSize: 12, fontWeight: 500 }}>
                You've got driver!
              </Text>
            </View>
            <Ionicons
              name="trophy-outline"
              size={18}
              color="#ffff"
              style={{ paddingLeft: 5 }}
            />
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: "8%",
              paddingVertical: "5%",
            }}
          >
            <View style={{ width: "50%" }}>
              <Image
                style={styles.profile}
                source={{
                  uri: `data:image/png;base64,${data.photo}`,
                }}
              />
              <Text style={{ fontWeight: 500, fontSize: 12, paddingTop: 10 }}>
                {data.name}
              </Text>
              <Text style={{ fontSize: 12, paddingTop: 10 }}>
                vehicle Capacity: {data.vehiclecapacity}
              </Text>
              {/* <View style={{ flexDirection: "row" }}>
                <Ionicons
                  name="star"
                  size={12}
                  color="black"
                  style={{ padding: 1 }}
                />
                <Ionicons
                  name="star"
                  size={12}
                  color="black"
                  style={{ padding: 1 }}
                />
                <Ionicons
                  name="star"
                  size={12}
                  color="black"
                  style={{ padding: 1 }}
                />
                <Ionicons
                  name="star"
                  size={12}
                  color="black"
                  style={{ padding: 1 }}
                />
                <Ionicons
                  name="star-half"
                  size={12}
                  color="black"
                  style={{ padding: 1 }}
                />
              </View> */}
            </View>
            <View style={{ justifyContent: "center", width: "40%" }}>
              <Image
                style={{ width: 55, height: 30, resizeMode: "contain" }}
                source={require("../../../assets/image/car.png")}
              />
              <Text style={{ fontSize: 14, fontWeight: 500, paddingTop: 10 }}>
                {data.vehiclenumber}
              </Text>
              <Text style={{ fontSize: 10, paddingTop: 10 }}>
                {data.vehiclebrand} - {data.vehiclecolor}
              </Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <Pressable
                onPress={() => {
                  Linking.openURL(`tel:${data.mobilenumber}`);
                }}
                style={({ pressed }) => ({
                  padding: 3,
                  borderWidth: 1,
                  borderColor: "#969696",
                  backgroundColor: pressed ? "#D1D1D1" : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <Ionicons name="call-outline" size={20} color="black" />
              </Pressable>

              <View style={{ paddingVertical: "10%" }}></View>

              <Pressable
                onPress={() => {
                  // Handle the WhatsApp press action here
                  const phoneNumber = "17123456"; // Replace with your phone number
                  Linking.openURL(`whatsapp://send?phone=${data.mobilenumber}`);
                }}
                style={({ pressed }) => ({
                  padding: 3,
                  borderWidth: 1,
                  borderColor: "#969696",
                  backgroundColor: pressed ? "#D1D1D1" : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <Ionicons name="logo-whatsapp" size={20} color="black" />
              </Pressable>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            paddingHorizontal: "8%",
            marginTop: "3%",
          }}
          onPress={() => setModalVisible(true)}
        >
          <View>
            <Ionicons name="create-outline" size={24} color="#4A4A4A" />
          </View>
          <View style={{ justifyContent: "center", paddingLeft: "1%" }}>
            <Text style={{ fontSize: 12 }}>Add Pick Up Note</Text>
          </View>
        </TouchableOpacity>
        {/* pickup note modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Add a pick up point note</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter description of place where you are ..."
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={handleTextChange}
              />
              <Pressable
                style={{
                  backgroundColor: "#FF6B00",
                  width: 100,
                  paddingVertical: "3%",
                  alignItems: "center",
                }}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={{ color: "white", fontSize: 12, fontWeight: 500 }}>
                  ADD
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <View
          style={{
            alignItems: "center",
            marginTop: "10%",
            paddingHorizontal: "8%",
            flexDirection: "row",
          }}
        >
          {/* <Pressable
            style={{
              ...styles.btn,
              backgroundColor: "#2D2D2D",
              marginRight: "4%",
              transform: [{ scale: 1 }],
            }}
            onPress={() => navigation.goBack()}
            // onPressIn={handleSubmitPressIn}
            // onPressOut={handleSubmitPressOut}
          >
            <Text style={{ color: "white", fontSize: 12 }}>Cancel</Text>
          </Pressable> */}
          <Pressable
            style={{
              ...styles.btn,
              backgroundColor: "#FF6B00",
              marginLeft: "4%",
              transform: [{ scale: submitPressed ? 0.98 : 1 }],
            }}
            // onPress={() => setShowAlert(true)}
            onPress={() => {
              openConfirmationAlert();
            }}
            onPressIn={handleSubmitPressIn}
            onPressOut={handleSubmitPressOut}
          >
            <Text style={{ color: "white", fontSize: 12 }}>Confirm Driver</Text>
          </Pressable>
        </View>
      </View>
      {/* <ConfirmDriverSuccess
        visible={showAlert}
        message="You have completed the transaction"
        navigation={navigation}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    position: "absolute",
    top: "12%",
    left: "5%",
    zIndex: 10, // To ensure it appears above other content
    padding: 5,
    borderRadius: 50,
    backgroundColor: "white",
  },
  buttonText: {
    color: "#969696",
    fontSize: 16,
  },
  btn: {
    width: "100%",
    alignItems: "center",
    paddingVertical: "4%",
  },
  profile: {
    width: 40,
    height: 40,
    // borderRadius: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: 250,
    textAlign: "left",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100, // Minimum height for multiline input
    fontSize: 12,
  },
});
