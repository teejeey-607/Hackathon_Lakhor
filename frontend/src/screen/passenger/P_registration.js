import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  StatusBar,
  Alert,
  Button,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
// import { Checkbox } from 'react-native-paper';
import axios from "axios";
import config from "../../../config";
import Checkbox from "expo-checkbox";
import * as SecureStore from "expo-secure-store";

export default function Register({ navigation }) {
  StatusBar.setBackgroundColor("white");
  StatusBar.setBarStyle("dark-content");

  const [link, setLink] = useState("");

  const [name, setName] = useState("");
  const [cid, setCid] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [eMobileNumber, set_eMobileNumber] = useState("");

  useEffect(() => {
    //testing the api to fetch data
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          `https://staging.bhutanndi.com/authentication/authenticate`,
          {
            grant_type: "client_credentials",
            client_id: "3tq7ho23g5risndd90a76jre5f",
            client_secret:
              "111rvn964mucumr6c3qq3n2poilvq5v92bkjh58p121nmoverquh",
          }
        );
        // setPassengers(response.data);
        // console.log("access token:", response.data.access_token);
        const token = response.data.access_token;

        if (response.data.access_token) {
          console.log("access token:", token);
          const response = await axios.post(
            `https://stageclient.bhutanndi.com/verifier/proof-request`,
            {
              proofName: "Foundational ID",
              proofAttributes: [
                {
                  name: "Full Name",
                  restrictions: [
                    {
                      cred_def_id:
                        "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                      schema_id:
                        "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                    },
                  ],
                },
                {
                  name: "Gender",
                  restrictions: [
                    {
                      cred_def_id:
                        "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                      schema_id:
                        "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                    },
                  ],
                },
                // {
                //   name: "Date of Birth",
                //   restrictions: [
                //     {
                //       cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                //       schema_id:
                //         "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                //     },
                //   ],
                // },
                {
                  name: "ID Type",
                  restrictions: [
                    {
                      cred_def_id:
                        "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                      schema_id:
                        "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                    },
                  ],
                },
                {
                  name: "ID Number",
                  restrictions: [
                    {
                      cred_def_id:
                        "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                      schema_id:
                        "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                    },
                  ],
                },
                // {
                //   name: "Household Number",
                //   restrictions: [
                //     {
                //       cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                //       schema_id:
                //         "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                //     },
                //   ],
                // },
                // {
                //   name: "Blood Type",
                //   restrictions: [
                //     {
                //       cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                //       schema_id:
                //         "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                //     },
                //   ],
                // },
                {
                  name: "Mobile Number",
                  restrictions: [],
                  selfAttestedAllowed: true,
                },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data["data"]["deepLinkURL"]);
          console.log(response.data["data"]["proofRequestThreadId"]);
          setLink(response.data["data"]["deepLinkURL"]);

          const threadId = response.data["data"]["proofRequestThreadId"];

          if (response.data["data"]["proofRequestThreadId"]) {
            const response = await axios.post(
              `${config.API_URL}/subscribe`,
              {
                ThreadID: threadId,
              }
            );
            console.log(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching passengers:", error);
      }
    };

    fetchAccessToken();
  }, []); // The empty dependency array ensures this effect runs only once on component mount

  const handlePress = async () => {
    const deepLink =
      "bhutanndidemo://data?url=https://staging-shortener.s3.ap-southeast-1.amazonaws.com/oY8jq7hI";
    try {
      await Linking.openURL(link);
    } catch (error) {
      console.error("Error opening deep link:", error);
    }
  };

  // const handleFormSubmit = () => {
  //     console.log('name', name);
  //     console.log('cid', cid);
  //     console.log('gender', gender.value);
  //     console.log('mobileNumber', mobileNumber);
  //     console.log('eMobileNumber', eMobileNumber);
  // }

  const handleFormSubmit = async () => {
    //if not checked the terms and condition show invalid notify
    console.log(checked);
    if (
      name.trim() !== "" &&
      cid.trim() !== "" &&
      gender !== "" &&
      eMobileNumber.trim() !== "" &&
      mobileNumber.trim() !== ""
    ) {
      if (checked) {
        try {
          const response = await axios.post(
            `${config.API_URL}/api/passengers`,
            {
              name: name,
              CID: cid,
              gender: gender.value,
              mobilenumber: mobileNumber,
              emergencycontactnumber: eMobileNumber,
            }
          );
          // if (response.data) console.log("response", response.status);
          if (response.data) {
            console.log("Response after registration:", response.data);
            const userId = response.data.id;
            console.log("id", userId);
            const trimmedMobileNumber = mobileNumber ? mobileNumber.trim() : "";

            const registeredData = {
              userId: userId,
              name: name,
              gender: gender.value,
              cid: cid,
              mobilenumber: trimmedMobileNumber,
              emergencycontactnumber: eMobileNumber,
            };
            console.log("login:", registeredData);

            await SecureStore.setItemAsync(
              "registeredData",
              JSON.stringify(registeredData)
            );
          }

          if (response.status === 201) {
            Alert.alert(
              "Registered",
              "You have been registered. Thank you.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.replace("P_Login");
                  },
                },
              ],
              { cancelable: false }
            );
          }
        } catch (e) {
          console.log("Error:", e);
          if (
            (e.response && e.response.status === 409) ||
            e.response.status === 400
          ) {
            Alert.alert(
              "Opps.",
              "It seems like you have already been registered.",
              [{ text: "OK" }],
              { cancelable: false }
            );
          } else if (e.response) {
            // If there's a response object but the status is not 409
            Alert.alert(
              "Error",
              `An error occurred with status: ${e.response.status}`,
              [{ text: "OK" }],
              { cancelable: false }
            );
          } else {
            // For other types of errors
            Alert.alert(
              "Error",
              "An unexpected error occurred. Please try again later.",
              [{ text: "OK" }],
              { cancelable: false }
            );
          }
        }
      } else {
        Alert.alert(
          "Opps.",
          "Please check the term and conditions checkbox.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        "Opps.",
        "Please fill out all the required fields before submitting.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  };

  const Genderdata = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Others", value: "Others" },
  ];

  const [checked, setChecked] = useState(false);

  const [cancelPressed, setCancelPressed] = useState(false);
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleCancelPressIn = () => {
    setCancelPressed(true);
  };

  const handleCancelPressOut = () => {
    setCancelPressed(false);
  };

  const handleSubmitPressIn = () => {
    setSubmitPressed(true);
  };

  const handleSubmitPressOut = () => {
    setSubmitPressed(false);
  };

  const handleInput1Submit = () => {
    // You can perform any logic or validation here
    // Move focus to the next input (input2)
    input2Ref.focus();
  };

  const handleInput2Submit = () => {
    // You can perform any logic or validation here
    // Move focus to the next input (input2)
    input3Ref.focus();
  };

  const handleInput3Submit = () => {
    // You can perform any logic or validation here
    // Move focus to the next input (input2)
    input4Ref.focus();
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }} bounces={false}>
      <View style={styles.mainContainer}>
        <View style={styles.image}>
          <Image
            style={styles.logo}
            source={require("../../../assets/image/logo.png")}
          />
          <Image
            style={styles.welcome}
            source={require("../../../assets/image/register.png")}
          />
        </View>

        <View style={styles.register}>
          <View>
            <Text style={[styles.text, { marginBottom: "5%" }]}>
              Passenger's Registration
            </Text>
            {/* name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Passenger's Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                onSubmitEditing={handleInput1Submit}
              />
            </View>
            {/* cid gender */}
            <View style={{ flexDirection: "row" }}>
              {/* cid */}
              <View
                style={[
                  styles.inputContainer,
                  { width: "64%", marginRight: "1%" },
                ]}
              >
                <Text style={styles.label}>CID/Passport/Permit No</Text>
                <TextInput
                  style={styles.input}
                  value={cid}
                  keyboardType="numeric"
                  onChangeText={setCid}
                  returnKeyType="next"
                  ref={(ref) => (input2Ref = ref)}
                  onSubmitEditing={handleInput2Submit}
                />
              </View>
              {/* gender */}
              <View
                style={[
                  styles.inputContainer,
                  { width: "34%", marginLeft: "1%" },
                ]}
              >
                <Text style={styles.label}>Gender</Text>
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={Genderdata}
                    maxHeight={200}
                    containerStyle={{ marginTop: "1%", borderRadius: 10 }}
                    labelField="label"
                    valueField="value"
                    placeholder=" "
                    itemTextStyle={{ fontSize: 10 }}
                    // searchPlaceholder="Search..."
                    value={gender}
                    onChange={setGender}
                    // ref={(ref) => (input3Ref = ref)}
                  />
                </View>
              </View>
            </View>
            {/*Mobile No */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile No</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ top: 12, color: "#AFAFAF", fontSize: 12 }}>
                  +975{" "}
                </Text>
                <View
                  style={{
                    borderRightWidth: 1,
                    height: "60%",
                    top: 8,
                    borderColor: "#AFAFAF",
                  }}
                ></View>
                <TextInput
                  style={[styles.input, { marginLeft: "3%" }]}
                  keyboardType="numeric"
                  maxLength={8}
                  placeholder="########"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  returnKeyType="next"
                  ref={(ref) => (input3Ref = ref)}
                  onSubmitEditing={handleInput3Submit}
                />
              </View>
            </View>
            {/* Emergency Contact */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Emergency Contact No</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ top: 12, color: "#AFAFAF", fontSize: 12 }}>
                  +975{" "}
                </Text>
                <View
                  style={{
                    borderRightWidth: 1,
                    height: "60%",
                    top: 8,
                    borderColor: "#AFAFAF",
                  }}
                ></View>
                <TextInput
                  style={[styles.input, { marginLeft: "3%" }]}
                  keyboardType="numeric"
                  placeholder="########"
                  maxLength={8}
                  value={eMobileNumber}
                  onChangeText={set_eMobileNumber}
                  returnKeyType="done"
                  ref={(ref) => (input4Ref = ref)}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.terms}>
          <Text style={[styles.text, { color: "#fff" }]}>
            Terms and Conditions
          </Text>
          <ScrollView nestedScrollEnabled={true}>
            <Text style={[styles.content, { color: "#fff" }]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              rhoncus, quam in lacinia gravida, ante quam varius sapien, eu
              egestas magna elit sit amet dui. Nullam cursus et nisi faucibus
              molestie. Mauris viverra mauris eu urna convallis scelerisque.
              Duis a elementum tellus. In sed lobortis nunc. Praesent
              ullamcorper luctus eros eu venenatis. Maecenas vel tincidunt
              lacus, at fringilla velit. Vivamus semper malesuada elit nec
              tempus. Pellentesque mollis nibh ut pretium dapibus. Morbi
              hendrerit risus eu risus dapibus, a finibus mi elementum.
              Suspendisse et elit quis justo vestibulum scelerisque sed eu
              libero. Nulla eros sem, vehicula id faucibus in, hendrerit eu
              eros. Praesent bibendum accumsan erat, ut facilisis nulla tempus
              at. Suspendisse potenti.
            </Text>
          </ScrollView>
        </View>
        <View
          style={{
            paddingHorizontal: "10%",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <View>
            <Checkbox
              color="#FF6B00"
              value={checked}
              onValueChange={setChecked}
            />
          </View>
          <View style={{ justifyContent: "center", paddingLeft: 5 }}>
            <Text style={{ fontSize: 10 }}>
              I have read and agreed to the terms and conditions
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: "10%",
            flexDirection: "row",
            marginTop: "6%",
          }}
        >
          {/* <Pressable
            style={{
              ...styles.btn,
              backgroundColor: "#2E3E31",
              marginRight: "4%",
              transform: [{ scale: cancelPressed ? 0.95 : 1 }],
            }}
            onPress={() => navigation.goBack()}
            onPressIn={handleCancelPressIn}
            onPressOut={handleCancelPressOut}
          >
            <Text style={{ color: "white", fontSize: 12 }}>Cancel</Text>
          </Pressable>

          <Pressable
            style={{
              ...styles.btn,
              backgroundColor: "#FF6B00",
              marginLeft: "4%",
              transform: [{ scale: submitPressed ? 0.95 : 1 }],
            }}
            onPress={handleFormSubmit}
            onPressIn={handleSubmitPressIn}
            onPressOut={handleSubmitPressOut}
          >
            <Text style={{ color: "white", fontSize: 12 }}>Submit</Text>
          </Pressable> */}

          <Button title="Open Deep Link" onPress={handlePress} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  logo: {
    width: "55%",
    resizeMode: "contain",
    height: "100%",
  },
  welcome: {
    width: "10%",
    resizeMode: "contain",
  },
  register: {
    marginTop: "10%",
    paddingHorizontal: "10%",
  },
  image: {
    flexDirection: "row",
    marginTop: "20%",
    alignSelf: "center",
  },
  text: {
    fontWeight: "800",
    fontSize: 14,
  },
  inputContainer: {
    borderColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: "5%",
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    paddingHorizontal: 5,
    marginLeft: 10,
    top: -10,
    left: 5,
    zIndex: 1,
    color: "#AFAFAF",
    fontSize: 10,
  },
  input: {
    height: 40,
    zIndex: 0,
    color: "gray",
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 10,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 12,
    color: "gray",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 12,
  },
  terms: {
    backgroundColor: "#535353",
    paddingHorizontal: "10%",
    paddingVertical: "4%",
    maxHeight: "25%",
    overflow: "scroll",
    marginTop: "5%",
  },
  content: {
    fontSize: 12,
    textAlign: "justify",
  },
  btn: {
    width: "46%",
    alignItems: "center",
    paddingVertical: "4%",
  },
  dropdownContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "white", // Background color of the dropdown container
    fontSize: 12,
  },
});
