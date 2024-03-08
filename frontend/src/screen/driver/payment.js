import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo and have installed the Ionicons library
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import config from "../../../config";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';

export default function DriverRide({ navigation }) {
  StatusBar.setBackgroundColor("transparent");
  StatusBar.setBarStyle("dark-content");

  const isFocused = useIsFocused();

  const [dataLoading, setDataLoading] = useState(false);

  // Access the route object to get the parameters
  const route = useRoute();
  // Extract the item parameter from route.params
  const { item, fare } = route.params;
  console.log(item);

  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission not granted");
        }
      } catch (error) {
        console.error("Error requesting location permission:", error);
      }
    };

    getLocationPermission();
  }, []);

  const [data, setData] = useState([]);
  //   const [fare, setFare] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [pickupPointCoords, setPickupPointCoords] = useState(null);

  //get the current driver id and the ride details of the current driver
  useEffect(() => {
    const fetchData = async () => {
      try {
        //get driver id from async or redux
        const storedRegisteredData = await SecureStore.getItemAsync("formData");
        if (storedRegisteredData) {
          const formData = JSON.parse(storedRegisteredData);
          const storedCID = formData.cid;

          console.log('dfsdfsdf cid', storedCID);
        setDataLoading(true);

        const response = await axios.get(
          `${config.API_URL}/api/rides/current/${storedCID}/info`
          //get current ride with information
        );
        setData(response.data);
      }

        // Example using Nominatim for destination (replace with actual implementation):
        const destinationResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${item.destination}`
        );

        const destinationData = destinationResponse.data;
        console.log(destinationData[0].name);

        // Example using Nominatim for pickup point (replace with actual implementation):
        const pickupResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${item.pickup_point}`
        );
        const pickupData = pickupResponse.data;
        console.log(pickupData[0].name);

        if (destinationData.length > 0 && pickupData.length > 0) {
          const destCoords = {
            latitude: parseFloat(destinationData[0].lat),
            longitude: parseFloat(destinationData[0].lon),
          };
          const pickupCoords = {
            latitude: parseFloat(pickupData[0].lat),
            longitude: parseFloat(pickupData[0].lon),
          };

          // Set state to update the UI
          setDestinationCoords(destCoords);
          setPickupPointCoords(pickupCoords);
        }
      } catch (e) {
        console.log("Error creating ride:", e);

        if (e.response && e.response.status === 404) {
          setData([]);
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [isFocused]); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

  // const [destinationCoords, setDestinationCoords] = useState(null);
  // const [pickupCoords, setDpickupCoords] = useState(null);

  if (dataLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
    
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#969696" />
      </TouchableOpacity>

      {data.length === 0 ? (
        // Display message when there is no current ride
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            No current ride
          </Text>
        </View>
      ) : (
        // Display the content when there is data
        <>
          <MapView
            style={{ flex: 1 }}
            showsUserLocation
            provider={PROVIDER_GOOGLE}
            mapType="standard"
            initialRegion={{
              latitude: pickupPointCoords.latitude,
              longitude: pickupPointCoords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {pickupPointCoords && (
              <Marker
                coordinate={{
                  latitude: pickupPointCoords.latitude,
                  longitude: pickupPointCoords.longitude,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <FontAwesome name="map-marker" size={40} color="green" />
                </View>
                <Callout style={{ width: 200, height: 50 }}>
                  <Text
                    style={{ fontSize: 12 }}
                  >{`Pickup Point: ${data.pickup_point}`}</Text>
                </Callout>
              </Marker>
            )}

            {destinationCoords && (
              <Marker
                coordinate={{
                  latitude: destinationCoords.latitude,
                  longitude: destinationCoords.longitude,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <FontAwesome name="map-marker" size={40} color="blue" />
                </View>
                <Callout style={{ width: 200, height: 50 }}>
                  <Text
                    style={{ fontSize: 12 }}
                  >{`Destination:${data.destination}`}</Text>
                </Callout>
              </Marker>
            )}
          </MapView>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: "15%",
              marginTop: "5%",
            }}
          >
            <View style={{ flexDirection: "row", width: "50%" }}>
              <View>
                <Image
                  style={styles.profile}
                  source={{
                    uri: `data:image/png;base64,${data.photo}`,
                  }}
                />
              </View>
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{ paddingLeft: "8%", fontSize: 13, fontWeight: 500 }}
                >
                  {data.name}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: "15%", marginVertical: "10%" }}>
            <Text style={{ fontSize: 12, fontWeight: 500 }}>Payment</Text>
            <View style={{ flexDirection: "row", marginTop: "5%" }}>
              <Pressable
                onPress={() =>
                  navigation.navigate("payment_qr", { data: data, fare: fare })
                }
                style={({ pressed }) => [
                  {
                    width: "50%",
                    alignItems: "center",
                    transform: [{ scale: pressed ? 0.95 : 1 }], // Reduce the size on press
                  },
                ]}
              >
                <Image
                  style={styles.payment}
                  source={require("../../../assets/image/QR.png")}
                />
                <Text style={{ fontSize: 12, fontWeight: 500 }}>Scan QR</Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  navigation.navigate("payment_cash", {
                    data: data,
                    fare: fare,
                  })
                }
                style={({ pressed }) => [
                  {
                    width: "50%",
                    alignItems: "center",
                    transform: [{ scale: pressed ? 0.95 : 1 }], // Reduce the size on press
                  },
                ]}
              >
                <Image
                  style={styles.payment}
                  source={require("../../../assets/image/cash.png")}
                />
                <Text style={{ fontSize: 12, fontWeight: 500 }}>Cash</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
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
  profile: {
    width: 40,
    height: 40,
    // borderRadius: 100,
  },
  payment: {
    width: 100,
    height: 100,
  },
});