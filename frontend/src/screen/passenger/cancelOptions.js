import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo and have installed the Ionicons library
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import config from "../../../config";

export default function CancelOption({ navigation }) {
  StatusBar.setBackgroundColor("transparent");
  StatusBar.setBarStyle("dark-content");

  const route = useRoute();
  const { data } = route.params;
  //   console.log(data);

  // onPress Button
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleSubmitPressIn = () => {
    setSubmitPressed(true);
  };

  const handleSubmitPressOut = () => {
    setSubmitPressed(false);
  };

  const handlePress = () => {
    // Check the current screen name and navigate accordingly
    if (route.name === "cancelOption") {
      navigation.navigate("payment");
    } else if (route.name === "cancelOpt") {
      navigation.navigate("pay");
    }
  };
  //   const [showAlert, setShowAlert] = useState(false);

  const handleRemovePassengerFromRide = async() => {
    const storedRegisteredData = await SecureStore.getItemAsync(
        "registeredData"
      );
      const user_data = JSON.parse(storedRegisteredData);
      console.log("Stored Registered Data:", user_data.userId); // Output: 7
  
      try {
        const res = await axios.patch(`${config.API_URL}/api/ride/passenger/remove`, {
          id: data.id, //ride id
          passenger: user_data.userId
        });
  
        console.log(res.data);
        openConfirmationAlert3();
      } catch (error) {
        console.log(error);
      }
  };

  const openConfirmationAlert3 = () => {
    Alert.alert(
      "Ride cancellation successful",
      `Your ride has been cancelled.`,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.popToTop();
          }, // Pass a function reference
          style: "destructive", // This will make the button orange
        },
      ],
      { cancelable: false }
    );
  };

  const openConfirmationAlert2 = () => {
    Alert.alert(
      "Ride cancellation confirmation",
      `Are you sure you want to cancel the ride?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            handleRemovePassengerFromRide();
          }, // Pass a function reference
          style: "destructive", // This will make the button orange
        },
      ],
      { cancelable: false }
    );
  };

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
          onPress={() => navigation.popToTop()}
        >
          <Ionicons name="arrow-back" size={24} color="#969696" />
        </TouchableOpacity>
        <Text>Cancel Option</Text>
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
                In progress...
              </Text>
            </View>
            {/* <Ionicons name="trophy-outline" size={18} color="#ffff" style={{paddingLeft:5}}/> */}
          </View>
        </View>
        <View style={{ height: 265 }}>
          <ScrollView>
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
                  <Text
                    style={{ fontWeight: 500, fontSize: 12, paddingTop: 10 }}
                  >
                    {data.name}
                  </Text>
                  <Text style={{ fontSize: 12, paddingTop: 10 }}>
                    Vehicle Capacity: {data.vehiclecapacity}
                  </Text>
                  <Text style={{ fontSize: 12, paddingTop: "10%" }}>
                    Destination: {data.destination}
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
                  <Text
                    style={{ fontSize: 14, fontWeight: 500, paddingTop: 10 }}
                  >
                    {data.vehiclenumber}
                  </Text>
                  <Text style={{ fontSize: 10, paddingTop: 10 }}>
                    {data.vehiclebrand} - {data.vehiclecolor}
                  </Text>
                </View>
                <View style={{ justifyContent: "center" }}>
                  <Pressable
                    onPress={() => {
                      Linking.openURL(`tel:${data.mobileNumber}`);
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
                      Linking.openURL(
                        `whatsapp://send?phone=${data.mobileNumber}`
                      );
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
            <View style={{ paddingHorizontal: "8%", paddingTop: 20 }}>
              {/* <Text style={{ fontSize: 12, fontWeight: 500 }}>
                CANCELLATION OPTIONS
              </Text> */}
              <View>
                <View style={{ flexDirection: "row" }}>
                  {/* <View style={{ width: "70%", justifyContent: "center" }}>
                    <Text style={{ fontSize: 9 }}>
                      GRACE PERIOD - 2 MIN FREE CANCELLATION
                    </Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Pressable
                      style={({ pressed }) => [
                        {
                          alignItems: "center",
                          paddingVertical: "5%",
                          backgroundColor: pressed ? "#0D7D24" : "#0F992E", // Darkened color and original color
                        },
                      ]}
                    >
                      <Text style={{ color: "white", fontSize: 11 }}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View> */}
                </View>
                {/* <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <View style={{ width: "70%", justifyContent: "center" }}>
                    <Text style={{ fontSize: 9 }}>
                      35% Charged from the full fare - 5 MINS
                    </Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Pressable
                      style={({ pressed }) => [
                        {
                          alignItems: "center",
                          paddingVertical: "5%",
                          backgroundColor: pressed ? "#8C8C8C" : "#969696", // Darkened color and original color
                        },
                      ]}
                    >
                      <Text style={{ color: "white", fontSize: 11 }}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <View style={{ width: "70%", justifyContent: "center" }}>
                    <Text style={{ fontSize: 9 }}>
                      <Text style={{ color: "#FF0000" }}>**</Text> After 5 mins
                      Cancellation
                    </Text>
                    <Text style={{ color: "#FF0000", fontSize: 6 }}>
                      **Full amount of the fare will be deducted from your
                      account
                    </Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Pressable
                      style={({ pressed }) => [
                        {
                          alignItems: "center",
                          paddingVertical: "5%",
                          backgroundColor: pressed ? "#E62626" : "#FF2929", // Darkened color and original color
                        },
                      ]}
                    >
                      <Text style={{ color: "white", fontSize: 11 }}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </View> */}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: "8%",
                marginTop: 6,
              }}
            >
              <Pressable
                style={{
                  ...styles.btn,
                  backgroundColor: "grey",
                  marginHorizontal: 5,
                }}
                onPress={openConfirmationAlert2}
              >
                <Text style={{ color: "white", fontSize: 12 }}>Cancel</Text>
              </Pressable>

              <Pressable
                style={{
                  ...styles.btn,
                  backgroundColor: "#FF6B00",
                  marginHorizontal: 5,
                  transform: [{ scale: submitPressed ? 0.98 : 1 }],
                }}
                onPress={handlePress}
                onPressIn={handleSubmitPressIn}
                onPressOut={handleSubmitPressOut}
              >
                <Text style={{ color: "white", fontSize: 12 }}>Proceed</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
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
    width: "50%",
    alignItems: "center",
    paddingVertical: "4%",
  },

  profile: {
    width: 40,
    height: 40,
    // borderRadius: 100,
  },
});
