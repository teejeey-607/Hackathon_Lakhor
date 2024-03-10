import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import isUserRegistered from "./isUserRegistered";
import { useAuth } from "./AuthContext";
import axios from "axios";
import config from "../../../config";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

export default function Passenger({ navigation }) {
  const { user } = useAuth();
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [registerPressed, setRegisterPressed] = useState(false);

  const [ThreadID, setThreadID] = useState(null);

  const handleRegisterPressIn = () => {
    setRegisterPressed(true);
  };

  const handleRegisterPressOut = () => {
    setRegisterPressed(false);
  };

  useEffect(() => {
    const checkUserRegistration = async () => {
      const userRegistered = await isUserRegistered();
      setShowLoginButton(userRegistered);
    };

    checkUserRegistration();

    // Check if the user is already logged in
    if (user) {
      // Redirect to 'PassengerTab' only if the user is logged in
      navigation.replace("PassengerTab");
    }
  }, [user]);

  const [Loading, setLoading] = useState(false);

  const register = async () => {
    console.log("tt,", ThreadID);
    if (ThreadID === null) {
      try {
        setLoading(true);
        const response = await axios.get(`${config.API_URL}/subscribe`);
        console.log(response.data.deepLinkURL);
        console.log(response.data.ThreadID);
        setThreadID(response.data.ThreadID);

        if (response.data) {
          try {
            await Linking.openURL(response.data.deepLinkURL);
          } catch (error) {
            console.error("Error opening deep link:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching passengers:", error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        // setLoading(true);
        console.log("validating threadID");
        const response = await axios.get(
          `${config.API_URL}/validate/${ThreadID}`
        );
        // console.log("validating threadID123");
        // // Handle response data here if needed
        // console.log(response.data["data"]["status"]);

        // if (response.data["data"]["status"] === "proofInvitationCreated"){
        //   setThreadID(null);
        // }

        if (response.data["data"]["status"] === "ProofValidated") {
          const response = await axios.get(
            `${config.API_URL}/api/passengers/v/${ThreadID}`
          );

          console.log(response.data);

          const registeredData = {
            userId: response.data.id,
            name: response.data.name,
            gender: response.data.gender,
            cid: response.data.cid,
            mobilenumber: response.data.mobilenumber,
          };
          console.log("login: registeredData", registeredData);

          await SecureStore.setItemAsync(
            "registeredData",
            JSON.stringify(registeredData)
          );

          navigation.replace("PassengerTab");
        }
      } catch (error) {
        console.error("Error occurred while validating:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isFocused = useIsFocused();

  // useEffect(() => {
  //   let intervalId;

  //   const fetchData = async () => {
  //     console.log("h2o", ThreadID); // Log the ThreadID value

  //     if (ThreadID) {
  //       console.log("h232o", ThreadID); // Log the ThreadID value
  //       try {
  //         const response = await axios.get(`${config.API_URL}/validate/${ThreadID}`);
  //         // Do something with the response if needed
  //         if (response.data["data"]["status"] === "ProofValidated")
  //         console.log("response.data");
  //         navigation.replace("PassengerTab");
  //         clearInterval(intervalId); // Clear the previous interval
  //         intervalId = setInterval(fetchData, 2000); // Set interval to run every 2 seconds
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }
  //     }
  //   };

  //   fetchData(); // Initial call to fetchData

  //   // Cleanup function to clear the interval when the component unmounts or ThreadID changes
  //   return () => clearInterval(intervalId);
  // }, [ThreadID]);

  // const login = async () => {
  //   try {

  //     const response = await axios.get(`${config.API_URL}/subscribe/login`);
  //     console.log(response.data.deepLinkURL);

  //     if (response.data) {
  //       try {
  //         await Linking.openURL(response.data.deepLinkURL);
  //       } catch (error) {
  //         console.error("Error opening deep link:", error);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching passengers:", error);
  //   }
  // };

  const handlePress = async () => {
    register();
  };

  // const handlePress2 = async () => {
  //   login();
  // };

  if (Loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="orange" />
        <Text>Please wait...</Text>
      </View>
    );

  return (
    <View style={styles.mainContainer}>
      <Image
        style={styles.dragon}
        source={require("../../../assets/image/bg.png")}
      />
      <Image
        style={styles.welcome}
        source={require("../../../assets/image/passenger.png")}
      />
      <Text style={styles.text}>Welcome to</Text>
      <Image
        style={styles.logo}
        source={require("../../../assets/image/logo.png")}
      />
      <View style={{ width: "100%", alignItems: "center" }}>
        <View
          style={{
            width: "80%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              borderWidth: 0.5,
              borderColor: "#626262",
              width: "40%",
              justifyContent: "center",
            }}
          ></View>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 15,
                width: "100%",
                paddingHorizontal: 10,
                fontWeight: 500,
                color: "#626262",
              }}
            >
              Using
            </Text>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: "#626262",
              width: "40%",
              justifyContent: "center",
            }}
          ></View>
        </View>
        <View
          style={{ backgroundColor: "#111B2B", borderRadius: 5, marginTop: 10 }}
        ></View>
        <TouchableOpacity
          onPress={handlePress}
          style={{
            borderWidth: 1,
            borderColor: "#111B2B",
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 15,
            width: "80%",
            marginTop: 40,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                height: 40,
                width: 40,
                backgroundColor: "black",
                marginRight: 20,
              }}
              source={require("../../../assets/image/ndi.png")}
            />
            <Text style={{ color: "#626262", fontWeight: 500 }}>
              {ThreadID
                ? "User authenticated, continue "
                : "Continue using BHUTAN NDI"}
            </Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={handlePress}
          style={{
            backgroundColor: "#111B2B",
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 15,
            marginTop: 8,
            width: "80%",
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: 500 }}>LOGIN</Text>
          </View>
        </TouchableOpacity> */}
      </View>
      {/* <View style={styles.role}>
        {!user && showLoginButton && (
          <Pressable
            style={loginButtonStyle}
            onPress={() => navigation.navigate('P_Login')}
            onPressIn={handleRegisterPressIn}
            onPressOut={handleRegisterPressOut}
          >
            <View style={styles.center}>
              <Text style={{ color: 'white', fontWeight: '600' }}>LOGIN</Text>
            </View>
          </Pressable>
        )}
          <Pressable
            style={registerButtonStyle}
            onPress={() => navigation.navigate('PassengerRegistration')}
            onPressIn={handleRegisterPressIn}
            onPressOut={handleRegisterPressOut}
          >
            <View style={styles.center}>
              <Text style={{ color: 'white', fontWeight: '600' }}>REGISTER</Text>
            </View>
          </Pressable>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  dragon: {
    marginTop: "15%",
    width: "90%",
    resizeMode: "contain",
  },
  welcome: {
    position: "absolute",
    marginTop: "30%",
    width: "32%",
    resizeMode: "contain",
  },
  logo: {
    marginTop: "5%",
    width: "55%",
    resizeMode: "contain",
    height: "15%",
  },
  text: {
    marginTop: "10%",
    fontWeight: "800",
    fontSize: 18,
    color: "#626262",
  },
  role: {
    paddingHorizontal: "10%",
    width: "100%",
    marginTop: "5%",
    color: "white",
  },
  btn: {
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    padding: "5%",
  },
  center: {
    alignItems: "center",
  },
});
