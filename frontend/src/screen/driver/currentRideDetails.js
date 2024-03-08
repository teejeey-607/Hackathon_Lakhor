import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import config from "../../../config";
import axios from "axios";

export default function D_CurrentRideDetails({ navigation }) {
  StatusBar.setBackgroundColor("transparent");
  StatusBar.setBarStyle("dark-content");

  // Access the route object to get the parameters
  const route = useRoute();
  // Extract the item parameter from route.params
  const { item } = route.params;
  console.log(item);

  const [fare, setFare] = useState("");

  useEffect(() => {
    const getFare = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/api/rideinfo`, {
          params: {
            pickup: item.pickup_point,
            destination: item.destination,
          },
        });
        // console.log(res.data.fare);
        if (res) setFare(res.data.fare);
      } catch (error) {
        console.log(error);
      }
    };

    getFare();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#0F992E" />
            </TouchableOpacity>
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
              Ride Details
            </Text>
          </View>
        </View>
      </View>
      {/* content */}
      <View style={{ marginTop: 10 }}>
        {/* ride info */}
        <View>
          <View
            style={{
              backgroundColor: "#F4F4F4",
              paddingVertical: 12,
              borderWidth: 0.5,
              borderColor: "#D9D9D9",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#6F6F6F",
                paddingHorizontal: "8%",
              }}
            >
              Ride Info
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: "8%",
              paddingVertical: 13,
              borderRadius: 5,
              marginBottom: 5,
              marginTop: 12,
            }}
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
              <View style={{ width: "88%", paddingLeft: "5%" }}>
                <Text style={{ fontSize: 10, fontWeight: 700 }}>
                  {item.pickup_point}
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
              <View style={{ width: "88%", paddingLeft: "5%" }}>
                <Text style={{ fontSize: 10, fontWeight: 700 }}>
                  {item.destination}
                </Text>
                <Text style={{ fontSize: 10, color: "#6D6D6D", marginTop: 5 }}>
                  Destination Location
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* passenger info */}
        <View style={{ paddingVertical: 5 }}>
          <View
            style={{
              backgroundColor: "#F4F4F4",
              paddingVertical: 12,
              borderWidth: 0.5,
              borderColor: "#D9D9D9",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#6F6F6F",
                paddingHorizontal: "8%",
              }}
            >
              Passenger Info
            </Text>
          </View>

          {/* show passengers details */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: "8%",
              paddingVertical: "5%",
            }}
          >
            <View style={{ width: "80%", justifyContent: "center" }}>
              <Text style={{ fontWeight: 500, fontSize: 13, color: "#626262" }}>
                Sonam Wangyel
              </Text>
              <Text style={{ fontWeight: 500, fontSize: 11, color: "#969696" }}>
                Male
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                width: "20%",
                flexDirection: "row",
              }}
            >
              <Pressable
                onPress={() => {
                  // Handle the call press action here
                  const phoneNumber = "17123456"; // Replace with your phone number
                  Linking.openURL(`tel:${phoneNumber}`);
                }}
                style={({ pressed }) => ({
                  padding: 3,
                  marginHorizontal: 4,
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
                  Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
                }}
                style={({ pressed }) => ({
                  padding: 3,
                  marginHorizontal: 4,
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
          <View style={{ paddingHorizontal: "8%", paddingBottom: "5%" }}>
            <Text style={{ fontWeight: 500, fontSize: 13, color: "#626262" }}>
              PickUp Note
            </Text>
            <View style={{ maxHeight: 90 }}>
              {/* <ScrollView> */}
              <Text style={{ fontSize: 11, color: "#969696", lineHeight: 20 }}>
                Thimphu Buddha Point, also known as the Kuensel Phodrang, offers
                breathtaking views of Thimphu Valley. Surrounded by lush hills,
                it's serene and spiritually captivating. 
              </Text>
              {/* </ScrollView> */}
            </View>
          </View>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#D9D9D9",
            marginHorizontal: "8%",
          }}
        >
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ width: "50%" }}>
              <Text style={{ color: "#8C8C8C", fontWeight: 500, fontSize: 14 }}>
                Total Cost:
              </Text>
            </View>
            <View style={{ width: "50%", alignItems: "flex-end" }}>
              <Text style={{ color: "#0F992E", fontWeight: 500, fontSize: 14 }}>
                Nu. {fare}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: "100%", alignItems: "center", marginTop: 50 }}>
          <Pressable
            style={({ pressed }) => ({
              ...styles.btn,
              backgroundColor: "#0F992E",
              marginLeft: "4%",
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
            onPress={() => navigation.navigate("pment", { item: item, fare:fare })}
          >
            <Text style={{ color: "white", fontSize: 11 }}>Proceed</Text>
          </Pressable>
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
  header: {
    marginTop: 40,
    paddingHorizontal: "8%",
  },

  btn: {
    width: "40%",
    alignItems: "center",
    paddingVertical: "3%",
  },
});