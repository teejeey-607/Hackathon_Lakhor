import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import config from "../../../config";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get("window");

export default function SelectedLD() {
  StatusBar.setBackgroundColor("transparent");
  StatusBar.setBarStyle("white-content");

  const route = useRoute();
  const destination = route.params?.destination; //getting the destination from hometab screen

  const [ride_data, setData] = useState([]);
  const [queue_no, setQueueNo] = useState(0);

  const [loading, setLoading] = useState(true);
  const [driver_id, setDriver_id] = useState(true);

  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  //need to fetch the rides from the db based on the destination using
  const fetchData = async () => {
    try {
      const storedRegisteredData = await SecureStore.getItemAsync("formData");
        if (storedRegisteredData) {
          const formData = JSON.parse(storedRegisteredData);
          const storedCID = formData.cid;
          console.log('storedCID', storedCID)
          setDriver_id(storedCID);
        }

      setLoading(true);
      const response = await axios.get(
        `${config.API_URL}/api/ride/destionation?destination=${destination}`
      );
      if (response) setData(response.data);
      // console.log("ride_data:", response.data);
      console.log("ride_data fetched:");
    } catch (e) {
      console.log("Error fetching data:", e);
      setData([]);
    } finally {
      setLoading(false);
      setQueueNo(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

  const deleteRide = async (ride_id) => {
    try {
      console.log("deleteRide", ride_id);
      const res = await axios.delete(`${config.API_URL}/api/ride`, {
        data: {
          id: ride_id,
        },
      });
      if (res) console.log("Ride deleted");
    } catch (error) {
      console.log("deleteRide", error);
    } finally {
      fetchData(); //fetch ride data
    }
  };

  const createRideFn = async () => {
    //when creating the ride get the driver id from async storage
    // AsyncStorage.getItem("driver_cid")
    //   .then((value) => {
    //     if (value !== null) {
    //       console.log("Retrieved value:", Number.parseInt(value));
    //       setDriver_id(value);
    //     } else {
    //       console.log("Value not found in AsyncStorage");
    //     }
    //   })
    //   .catch((error) =>
    //     console.error("Error getting value from AsyncStorage:", error)
    //   );

    try {
      // Assuming you have the necessary data to send in the request body
      const response = await axios.post(`${config.API_URL}/api/ride`, {
        //create ride
        destination: destination,
        pickup_point: "Thimphu",
        driver: Number.parseInt(driver_id), //get the drive id from redux or async storage
        ride_type: "LD", //long distance
        ride_status: "pending",
      });

      //   console.log("Ride creation successful:", response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("You are already in a queue.");
        showToast("You are already in a queue.");
        return;
      } else {
        // Handle other errors
        console.log("Error creating ride:", error);
      }
    } finally {
      // Redirect to the next screen after successful ride creation
      fetchData();
    }
  };

  const openConfirmationAlert = () => {
    Alert.alert(
      "Ride Confirmation",
      `Do you want to get in the queue? Destination: ${destination}`,
      [
        {
          text: "Yes",
          onPress: () => createRideFn(), // Pass a function reference
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

  const openConfirmationAlert2 = (item) => {
    Alert.alert(
      "Ride Cancel Confirmation",
      `Do you want to cancel the ride? Destination: ${destination}`,
      [
        {
          text: "Yes",
          onPress: () => deleteRide(item), // Pass a function reference
          style: "destructive", // This will make the button orange
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const ListItem = ({ item, index }) => {
    // Convert the ISO 8601 timestamp to a Date object
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

    {
      item.cid == driver_id && setQueueNo(index);
    }
    // get the queue number if the driver id exists

    return (
      <View
        style={{
          //driver id item.driver == get the driver id from the async or redux //item.id should be item.driver
          backgroundColor:
            item.cid == driver_id ? "rgba(255, 107, 0, 0.2)" : "white",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: "7%",
            paddingVertical: "5%",
          }}
        >
          <View style={{ width: "50%", justifyContent: "center" }}>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Image
                  style={styles.profile}
                  source={{
                    uri: `data:image/png;base64,${item.photo}`,
                  }}
                />
              </View>
              <View style={{ justifyContent: "center", marginLeft: 15 }}>
                <Text style={{ fontWeight: 600, fontSize: 13 }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: "#FF6B00",
                    fontSize: 12,
                    fontWeight: 400,
                    marginTop: 5,
                  }}
                >
                  {formattedDateTime}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              width: "50%",
              alignItems: "flex-end",
            }}
          >
            <Image
              style={{ width: 55, height: 30, resizeMode: "contain" }}
              source={require("../../../assets/image/car.png")}
            />
            {item.vehiclenumber ? (
              <>
                <Text style={{ fontSize: 14, fontWeight: 500 }}>
                  {item.vehiclenumber}
                </Text>
                <Text style={{ fontSize: 10 }}>
                  {item.vehiclebrand} - {item.vehiclecolor}
                </Text>
              </>
            ) : (
              <Text>No car details available</Text>
            )}
          </View>
        </View>

        {/* set the queue no if the cid is in the list */}
        {item.cid == driver_id && (
          <Pressable
            style={{ backgroundColor: "#FE2545", padding: 20 }}
            onPress={() => openConfirmationAlert2(item.id)}
          >
            <Text>Cancel Ride</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/image/deleteItLater.jpg")}
        style={{
          alignItems: "center",
          width: width,
          height: width / 2,
        }}
      ></ImageBackground>

      {/* display the driver destionation, number and queue of the driver */}
      <FlatList
        ListHeaderComponent={
          <View
            style={{
              paddingHorizontal: "7%",
              flexDirection: "row",
              paddingVertical: "5%",
            }}
          >
            <View style={{ width: "60%" }}>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>
                Destination: {destination}
              </Text>
              <Text style={{ fontSize: 22, fontWeight: 500 }}>
                {ride_data.length === 0
                  ? "No Drivers"
                  : ride_data.length === 1
                  ? "1 Driver"
                  : `${ride_data.length} Drivers`}
              </Text>
            </View>
            <View style={{ width: "40%" }}>
              <Text style={{ fontSize: 14, fontWeight: "500" }}>
                {queue_no > 0 && ride_data.length > 0 && "Your Queue No."}
              </Text>
              <Text style={{ fontSize: 22, fontWeight: "500" }}>
                {queue_no > 0 && ride_data.length > 0 ? (
                  <Text style={{ color: "#FF6B00" }}>
                    {queue_no}/{ride_data.length}
                  </Text>
                ) : (
                  <Pressable
                    onPress={() => openConfirmationAlert()}
                    style={{
                      backgroundColor: "green",
                      borderRadius: 5,
                      padding: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "white" }}>
                      Create A Ride
                    </Text>
                  </Pressable>
                )}
              </Text>
            </View>
          </View>
        }
        data={ride_data}
        renderItem={({ item, index }) => (
          <ListItem item={item} index={index + 1} />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20, // Add padding here as needed
              backgroundColor: "lightgrey",
            }}
          >
            <Text style={{ color: "gray" }}>
              {loading ? (
                <ActivityIndicator size="large" color="#FF6B00" />
              ) : (
                <Text>No Drivers</Text>
              )}
            </Text>
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
});