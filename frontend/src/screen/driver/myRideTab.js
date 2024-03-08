import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import config from "../../../config";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';

export default function DriverRide({ navigation }) {
  StatusBar.setBackgroundColor("transparent");
  StatusBar.setBarStyle("dark-content");

  const isFocused = useIsFocused(); //to rende rwhen the screen is focused

  const [currentRides, setCurrentRides] = useState(true);

  const toggleRides = () => {
    setCurrentRides(!currentRides);
  };

  let lastDate = null;

  // const [driver_id, setDriver_id] = useState("");
  const [currentRide, setCurrentRide] = useState([]);
  const [pastRides, setPastRide] = useState([]);

  useEffect(() => {
    const fetchRides = async (endpoint) => {
      try {
        const storedRegisteredData = await SecureStore.getItemAsync("formData");
        if (storedRegisteredData) {
          const formData = JSON.parse(storedRegisteredData);
          const storedCID = formData.cid;

          console.log('dfsdfsdf cid', storedCID);

          const response = await axios.get(
            `${config.API_URL}/api/rides/${endpoint}/${storedCID}`
          );
  
          return response.data;

        }
       
      } catch (error) {
        console.log(`No ${endpoint} rides found for the driver`);
        console.log(error);
      }
    };

    const loadRides = async () => {
      try {
        const currentRides = await fetchRides("current");
        const pastRides = await fetchRides("done");

        setCurrentRide(currentRides && [currentRides]);
        setPastRide(pastRides && pastRides);
      } catch (error) {
        // Handle any other errors that might occur during the loading process
        console.error("Error loading rides:", error);
      }
    };

    loadRides();
  }, [isFocused]);

  const renderItem = ({ item }) => {
    const truncateText = (text, maxLength) => {
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    };

    const truncatedPickupLocation = truncateText(item.pickup_point, 35);
    const truncatedDestinationLocation = truncateText(item.destination, 35);

    return (
      <View>
        <Pressable
          style={{
            marginHorizontal: "8%",
            padding: 13,
            backgroundColor: "#F4F4F4",
            borderRadius: 5,
            marginBottom: 5,
          }}
          onPress={() => navigation.navigate("cRide", { item: item })}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 15,
                  width: 15,
                  backgroundColor: "#D9D9D9",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: 8,
                    width: 8,
                    backgroundColor: "#878787",
                    borderRadius: 100,
                  }}
                ></View>
              </View>
            </View>
            <View style={{ width: "88%", paddingHorizontal: "5%" }}>
              <Text style={{ fontSize: 10, fontWeight: 700 }}>
                {truncatedPickupLocation}
              </Text>
              <Text style={{ fontSize: 10, color: "#6D6D6D", marginTop: 5 }}>
                Pickup Location
              </Text>
            </View>
          </View>

          {/* <View style={{ paddingLeft:width/9.5, marginTop: 30, position: 'absolute', transform: [{ rotate: '90deg' }] }}>
          <Text>......</Text>
        </View>
   */}
          <View style={{ flexDirection: "row", marginTop: "10%" }}>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="location"
                size={18}
                color="red"
                style={{ marginTop: "5%" }}
              />
            </View>
            <View style={{ width: "88%", paddingHorizontal: "5%" }}>
              <Text style={{ fontSize: 10, fontWeight: 700 }}>
                {truncatedDestinationLocation}
              </Text>
              <Text style={{ fontSize: 10, color: "#6D6D6D", marginTop: 5 }}>
                Destination Location
              </Text>
            </View>
          </View>
        </Pressable>
        <View style={{ paddingVertical: 5 }}></View>
      </View>
    );
  };

  const renderPastRide = ({ item }) => {
    const truncateText = (text, maxLength) => {
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    };

    const truncatedPickupLocation = truncateText(item.pickup_point, 35);
    const truncatedDestinationLocation = truncateText(item.destination, 35);

    const timestamp = new Date(item.created_at);

    // Format the date and time in 12-hour format using Intl.DateTimeFormat
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      // year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }).format(timestamp);

    return (
      <View>
        {/* Only render the date view if the current date is different from the last date */}
        {item.date !== lastDate && (
          <View style={{ backgroundColor: "#F4F4F4" }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "bold",
                color: "#333",
                paddingHorizontal: "8%",
                paddingVertical: 5,
              }}
            >
              {formattedDateTime}
            </Text>
          </View>
        )}
        <Pressable
          style={{
            marginHorizontal: "8%",
            padding: 13,
            backgroundColor: "#F4F4F4",
            borderRadius: 5,
            marginBottom: 5,
            marginTop: 12,
          }}
          onPress={() => navigation.navigate("pRide")}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 15,
                  width: 15,
                  backgroundColor: "#D9D9D9",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: 8,
                    width: 8,
                    backgroundColor: "#878787",
                    borderRadius: 100,
                  }}
                ></View>
              </View>
            </View>
            <View style={{ width: "88%", paddingHorizontal: "5%" }}>
              <Text style={{ fontSize: 10, fontWeight: 700 }}>
                {truncatedPickupLocation}
              </Text>
              <Text style={{ fontSize: 10, color: "#6D6D6D", marginTop: 5 }}>
                Pickup Location
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: "10%" }}>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="location"
                size={18}
                color="red"
                style={{ marginTop: "5%" }}
              />
            </View>
            <View style={{ width: "88%", paddingHorizontal: "5%" }}>
              <Text style={{ fontSize: 10, fontWeight: 700 }}>
                {truncatedDestinationLocation}
              </Text>
              <Text style={{ fontSize: 10, color: "#6D6D6D", marginTop: 5 }}>
                Destination Location
              </Text>
            </View>
          </View>
        </Pressable>
        <View style={{ paddingVertical: 5 }}></View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <View>
            <Ionicons name="car" size={24} color="#535353" />
          </View>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                color: "#535353",
                fontSize: 15,
                fontWeight: "600",
                paddingLeft: 10,
              }}
            >
              My Ride
            </Text>
          </View>
        </View>
      </View>
      {/* content */}
      <View>
        <View style={styles.rideCat}>
          <Pressable
            style={{
              ...styles.toggle,
              backgroundColor: currentRides ? "#0F992E" : "transparent",
            }}
            onPress={toggleRides}
          >
            <Text
              style={{
                fontWeight: 500,
                fontSize: 12,
                color: currentRides ? "white" : "#535353",
              }}
              onPress={toggleRides}
            >
              Current Rides
            </Text>
          </Pressable>
          <Pressable
            style={{
              ...styles.toggle,
              backgroundColor: currentRides ? "transparent" : "#0F992E",
            }}
            onPress={toggleRides}
          >
            <Text
              style={{
                fontWeight: 500,
                fontSize: 12,
                color: currentRides ? "#535353" : "white",
              }}
              onPress={toggleRides}
            >
              Past Rides
            </Text>
          </Pressable>
        </View>
      </View>
      {/* Render content based on the selected toggle */}
      <View>
        {currentRides ? (
          <FlatList
            style={{ height: "85%", paddingTop: 10, marginBottom: 10 }}
            data={currentRide}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()} // Assuming `id` is unique
            ListEmptyComponent={
              <View>
                <Text style={{ textAlign: "center", marginTop: 40 }}>
                  No current ride.
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            style={{ height: "85%", marginBottom: 10 }}
            data={pastRides}
            renderItem={renderPastRide}
            keyExtractor={(item) => item.id.toString()} // Assuming `id` is unique
            ListEmptyComponent={
              <View>
                <Text style={{ textAlign: "center", marginTop: 40 }}>
                  No past ride.
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    marginTop: 40,
    paddingHorizontal: "8%",
  },
  rideCat: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#D9D9D9",
    marginTop: 10,
  },
  toggle: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  contentContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#535353",
  },
});