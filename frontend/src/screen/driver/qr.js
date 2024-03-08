import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useState } from "react";
import SuccessAlert from "./SuccessAlert";
import { useRoute } from "@react-navigation/native";
import axios from "axios"; // Import Axios
import config from "../../../config"; // Import your config file

const { width } = Dimensions.get("window");

export default function QR({ navigation }) {
  const route = useRoute();
  const { data, fare } = route.params;

  StatusBar.setBackgroundColor("transparent");
  StatusBar.setBarStyle("dark-content");

  //upadte the ride_status to done so that the driver can create new ride
  //todo
  const ConfirmPayment = async () => {
    try {
      // const rideId = 9; // Replace with your actual rideId //get ride id from aysnc storage
      console.log(data.id);

      //   console.log(response.data);
      console.log("status updated successfully");

      // setShowAlert(true);
      Alert.alert("Confirmation", `Are you sure you want to end the ride?`, [
        {
          text: "YES",
          onPress: async () => {
            // Fixed the onPress callback to be asynchronous
            try {
              const response = await axios.patch(
                `${config.API_URL}/api/ride/status`,
                {
                  id: data.id, //ride id
                }
              );
              if (response) {
                navigation.popToTop();
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  //same for the payment screen
  const [showAlert, setShowAlert] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image
          style={styles.payment}
          source={{
            uri: `data:image/png;base64,${data.qrcode}`,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: "15%",
          marginTop: "5%",
        }}
      ></View>
      <View
        style={{
          paddingHorizontal: "15%",
          marginTop: "4%",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: 500 }}>
          You have reached your destination!
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: "10%",
          paddingVertical: "5%",
          backgroundColor: "#D9D9D9",
          marginTop: "10%",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%" }}>
            <Text style={{ fontSize: 12, fontWeight: 600 }}>From:</Text>
            <Text style={{ fontSize: 11 }}>{data.pickup_point}</Text>

            <Text style={{ fontSize: 12, fontWeight: 600, marginTop: "5%" }}>
              To
            </Text>
            <Text style={{ fontSize: 11 }}>{data.destination}</Text>
          </View>
          <View style={{ width: "40%", justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 14, fontWeight: 600 }}>Nu.{fare}</Text>
            {/* get the amount from ride_info table based on location */}
          </View>
        </View>
      </View>
      <View
        style={{ paddingHorizontal: "10%", marginTop: "5%", width: "100%" }}
      >
        <View
          style={{
            width: "50%",
            backgroundColor: "white",
            flexDirection: "row",
          }}
        >
          <View style={{ width: "40%" }}>
            <Text style={{ fontSize: 18, fontWeight: 500 }}>QR </Text>
          </View>
          <View
            style={{
              width: "50%",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: 500 }}> Received:</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: "5%" }}>
          <View
            style={{
              width: "48%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#D9D9D9",
              borderRadius: 15,
              marginRight: "2%",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: 500 }}>Nu. {fare}</Text>
          </View>
          <View style={{ width: "48%", marginLeft: "2%" }}>
            <Pressable
              onPress={ConfirmPayment}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: "#0F992E",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  transform: [{ scale: pressed ? 0.95 : 1 }], // Reduce the size on press
                },
              ]}
            >
              <Text style={{ fontSize: 12, fontWeight: 400, color: "white" }}>
                End Ride
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.popToTop()}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: "#2E3E31",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "5%",
                  transform: [{ scale: pressed ? 0.95 : 1 }], // Reduce the size on press
                },
              ]}
            >
              <Text style={{ fontSize: 12, fontWeight: 400, color: "white" }}>
                Cancel
              </Text>
            </Pressable>
            <SuccessAlert
              visible={showAlert}
              message="You have completed the transaction"
              navigation={navigation}
            />
          </View>
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

  payment: {
    width: width / 1.15,
    height: width / 1.15,
    marginTop: "11%",
  },
  btn: {
    alignItems: "center",
    paddingVertical: "7%",
  },
});