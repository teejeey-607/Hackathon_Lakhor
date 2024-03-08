import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  StatusBar,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import config from "../../../config";
import * as SecureStore from 'expo-secure-store';

const Bank = [
  { label: "Bhutan National Bank Ltd", value: "BNB" },
  { label: "Bank of Bhutan", value: "BOB" },
  { label: "Tashi Bank Ltd", value: "TB" },
  { label: "Bhutan Development Bank Ltd", value: "BDBL" },
  { label: "Druk PNB Ltd", value: "PNB" },
  { label: "Digital Kidu", value: "DK" },
];

export default function Register({ navigation }) {
  StatusBar.setBackgroundColor("white");
  StatusBar.setBarStyle("dark-content");
  //gender
  const [cid, setCid] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [checked, setChecked] = useState(false);

  // onPress Button
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

  const storeData = async () => {



    try {
      // Store the form data in SecureStore as a JSON string
      const formData = {
        cid: cid,
        name: name,
        licencenumber: licencenumber,
        gender: gender,
        mobilenumber: mobileNumber,
        vehiclenumber: vehiclenumber,
        vehiclebrand: vehiclebrand,
        vehiclecolor: vehiclecolor,
        vehicletype: vehicletype,
        vehiclecapacity: vehiclecapacity,
        bankaccount: bank,
        accountnumber: bankAccNo,
        image: image,
        qrCode: QR,
      };
      await SecureStore.setItemAsync('formData', JSON.stringify(formData));
      console.log('local', formData);
    } catch (error) {
      console.error('Error storing data in SecureStore', error);
    }
  };

  //image
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    delete result.cancelled;

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  //QR
  const [QR, setQR] = useState(null);

  const pickQR = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    delete result.cancelled;

    if (!result.canceled) {
      setQR(result.assets[0].uri);
    }
  };

  //account No
  const [requiredAccountDigit, setRequiredAccountDigit] = useState(0);

  const [name, setName] = useState("");
  const [licencenumber, setLicencenumber] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [vehiclenumber, setVehiclenumber] = useState("");
  const [vehiclebrand, setVehiclebrand] = useState("");
  const [vehiclecolor, setVehiclecolor] = useState("");
  const [vehicletype, setVehicletype] = useState("");
  const [vehiclecapacity, setVehiclecapacity] = useState("");

  const [bank, setBank] = useState("");
  const [bankAccNo, setBankAccNo] = useState("");

  const fetchDriverInfo = async (cid) => {
    setCid(cid);
    setIsLoading(false);
    //axios fetch
    if (cid.length === 11) {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `${config.API_URL}/api/drivers/${cid}`
        );
        if (response) {
          const driver = response.data[0];
          setName(driver.name);
          setLicencenumber(driver.licencenumber);
          setGender(driver.gender);
          setMobileNumber(driver.mobilenumber);
          setVehiclenumber(driver.vehiclenumber);
          setVehiclebrand(driver.vehiclebrand);
          setVehiclecolor(driver.vehiclecolor);
          setVehicletype(driver.vehicletype);
          setVehiclecapacity(driver.vehiclecapacity);
          setIsLoading(false);
        }
      } catch (e) {
        // console.log(e);
        if (e.response && e.response.status === 404) {
          setIsLoading(false);
          Alert.alert(
            "Opps.",
            "We couldn't find any driver data for this CID.",
            [{ text: "OK" }],
            { cancelable: false }
          );
        }
      }
    } else {
      setName("");
      setLicencenumber("");
      setGender("");
      setMobileNumber("");
      setVehiclenumber("");
      setVehiclebrand("");
      setVehiclecolor("");
      setVehicletype("");
      setVehiclecapacity("");
    }
  };

  const handleSubmit = async () => {
    // Check if any of the required fields are empty
    if (
      cid === "" ||
      name === "" ||
      licencenumber === "" ||
      gender === "" ||
      mobileNumber === "" ||
      vehiclenumber === "" ||
      vehiclebrand === "" ||
      vehiclecolor === "" ||
      vehicletype === "" ||
      vehiclecapacity === "" ||
      bank === "" ||
      bankAccNo === "" ||
      image === null ||
      QR === null
    ) {
      Alert.alert(
        "Opps.",
        "Please fill out all the required fields before submitting.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return; // Stop further execution
    }

    try {
      const formData = new FormData();
      formData.append("CID", cid);
      formData.append("name", name);
      formData.append("licenceNumber", licencenumber);
      formData.append("gender", gender);
      formData.append("mobileNumber", mobileNumber);

      formData.append("vehicleNumber", vehiclenumber);
      formData.append("vehicleBrand", vehiclebrand);
      formData.append("vehicleColor", vehiclecolor);
      formData.append("vehicleType", vehicletype);
      formData.append("vehicleCapacity", vehiclecapacity);

      formData.append("bankAccount", bank);
      formData.append("accountNumber", bankAccNo);

      formData.append("userprofile", {
        uri: image,
        name: "image.jpg",
        type: "image/jpg",
      });

      formData.append("qrcode", {
        uri: QR,
        name: "image.jpg",
        type: "image/jpg",
      });

      if (checked) {

        await storeData();

        const res = await axios.patch(
          `${config.API_URL}/api/drivers`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res.status);

        if (res.status === 201 || res.status === 200) {
          Alert.alert(
            "Registered",
            "You have been registered. Thank you.",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.replace("D_Login");
                },
              },
            ],
            { cancelable: false }
          );
        }
      } else {
        // If the checkbox is not checked, display an alert
        Alert.alert(
          "Opps.",
          "Please check the the terms and conditions box to proceed.",
          [{ text: "OK" }],
          { cancelable: false }
        );
        return; // Stop further execution
      }
    } catch (e) {
      console.log("Error:", e);
      if (e.response && e.response.status === 409) {
        Alert.alert(
          "Opps.",
          "It seems like you have already been registered.",
          [{ text: "OK",  onPress: () => {
            navigation.replace("D_Login");
          }, }],
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
  };

  return (
    <ScrollView style={styles.mainContainer} bounces={false}>
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
            Driver's Registration
          </Text>
          {/* cid */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Citizen ID</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={fetchDriverInfo}
              value={cid}
            />
          </View>
          {isLoading && <ActivityIndicator size="large" color="#0F992E" />}
          {/* Drivers name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}> Driver's Name</Text>
            <TextInput
              style={styles.input}
              editable={false}
              placeholder="Auto-generated"
              value={name}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            {/* Licence */}
            <View
              style={[
                styles.inputContainer,
                { width: "64%", marginRight: "1%" },
              ]}
            >
              <Text style={styles.label}>Driver's Licence No.</Text>
              <TextInput
                style={styles.input}
                maxLength={11}
                editable={false}
                placeholder="Auto-generated"
                value={licencenumber}
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
                <TextInput
                  style={styles.input}
                  editable={false}
                  placeholder="Auto-generated"
                  value={gender}
                />
              </View>
            </View>
          </View>
          {/*Mobile No */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile No</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ top: 11, color: "#AFAFAF", fontSize: 12 }}>
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
                editable={false}
                placeholder="Auto-generated"
                value={mobileNumber}
              />
            </View>
          </View>
          {/* photo */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Upload Photo</Text>
            <TouchableOpacity
              onPress={pickImage}
              style={{ backgroundColor: "#fff", padding: 10, borderRadius: 5 }}
            >
              <Ionicons
                style={{ alignSelf: "flex-end" }}
                color="gray"
                name="camera"
                size={20}
              />
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  width: "100%",
                  height: 200,
                  alignSelf: "center",
                  marginBottom: "5%",
                }}
              />
            )}
          </View>

          <Text style={[styles.text, { marginBottom: "5%", marginTop: "5%" }]}>
            Driver's Car Details
          </Text>

          <View style={{ flexDirection: "row" }}>
            {/* Vehicle No */}
            <View
              style={[
                styles.inputContainer,
                { width: "49%", marginRight: "1%" },
              ]}
            >
              <Text style={styles.label}>Vehicle No.</Text>
              <View style={{ height: 40, justifyContent: "center" }}>
                <TextInput
                  style={styles.input}
                  editable={false}
                  placeholder="Auto-generated"
                  value={vehiclenumber}
                />
              </View>
            </View>

            {/* Vehicle Brand */}
            <View
              style={[
                styles.inputContainer,
                { width: "49%", marginLeft: "1%" },
              ]}
            >
              <Text style={styles.label}>Vehicle Brand</Text>
              <View style={{ height: 40, justifyContent: "center" }}>
                <TextInput
                  style={styles.input}
                  editable={false}
                  placeholder="Auto-generated"
                  value={vehiclebrand}
                />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            {/* Vehicle color */}
            <View
              style={[
                styles.inputContainer,
                { width: "49%", marginRight: "1%" },
              ]}
            >
              <Text style={styles.label}>Vehicle Color</Text>
              <View style={{ height: 40, justifyContent: "center" }}>
                <TextInput
                  style={styles.input}
                  editable={false}
                  placeholder="Auto-generated"
                  value={vehiclecolor}
                />
              </View>
            </View>

            {/* Vehicle type */}
            <View
              style={[
                styles.inputContainer,
                { width: "49%", marginLeft: "1%" },
              ]}
            >
              <Text style={styles.label}>Vehicle Type</Text>
              <View style={{ height: 40, justifyContent: "center" }}>
                <TextInput
                  style={styles.input}
                  editable={false}
                  placeholder="Auto-generated"
                  value={vehicletype}
                />
              </View>
            </View>
          </View>
          {/* Vehicle capacity */}
          <View style={[styles.inputContainer, { width: "50%" }]}>
            <Text style={styles.label}>Vehicle capacity</Text>
            <TextInput
              style={styles.input}
              editable={false}
              placeholder="Auto-generated"
              value={vehiclecapacity.toString()}
            />
          </View>

          <Text style={[styles.text, { marginBottom: "5%", marginTop: "5%" }]}>
            Bank Details
          </Text>

          <View style={{ flexDirection: "row" }}>
            {/* Bank */}
            <View
              style={[
                styles.inputContainer,
                { width: "49%", marginRight: "1%" },
              ]}
            >
              <Text style={styles.label}>Bank</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={Bank}
                maxHeight={200}
                containerStyle={{
                  marginTop: "1%",
                  borderRadius: 10,
                  color: "white",
                  backgroundColor: "black",
                  opacity: 0.7,
                }}
                labelField="label"
                valueField="value"
                placeholder=" "
                itemTextStyle={{ fontSize: 10, color: "white" }}
                searchPlaceholder="Search..."
                value={bank}
                onChange={(item) => {
                  setBank(item.value);
                  if (item.value === "BOB") {
                    // Set the required account number digit for this bank
                    setRequiredAccountDigit(9);
                  } else if (item.value === "BNB") {
                    setRequiredAccountDigit(13);
                  } else if (item.value === "BDBL") {
                    setRequiredAccountDigit(13);
                  } else if (item.value === "DK") {
                    setRequiredAccountDigit(12);
                  } else if (item.value === "TB") {
                    setRequiredAccountDigit(13);
                  } else if (item.value === "PNB") {
                    setRequiredAccountDigit(13);
                  } else {
                    setRequiredAccountDigit(0);
                  }
                }}
              />
            </View>

            {/*ACC No */}
            <View
              style={[
                styles.inputContainer,
                { width: "49%", marginLeft: "1%" },
              ]}
            >
              <Text style={styles.label}>Account No</Text>
              <TextInput
                style={styles.input}
                maxLength={requiredAccountDigit}
                keyboardType="numeric"
                onChangeText={setBankAccNo}
                // value={bankAccNo}
              />
            </View>
          </View>
          {/* QR*/}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Upload Bank QR Code</Text>
            <TouchableOpacity
              onPress={pickQR}
              style={{ backgroundColor: "#fff", padding: 10, borderRadius: 5 }}
            >
              <Ionicons
                style={{ alignSelf: "flex-end" }}
                color="gray"
                name="camera"
                size={20}
              />
            </TouchableOpacity>
            {QR && (
              <Image
                source={{ uri: QR }}
                style={{
                  width: "100%",
                  height: 300,
                  marginBottom: "5%",
                  alignSelf: "center",
                }}
              />
            )}
          </View>
        </View>
      </View>
      <View style={styles.terms}>
        <Text style={[styles.text, { color: "#fff" }]}>
          Terms and Conditions
        </Text>
        <ScrollView nestedScrollEnabled={true}>
          <Text style={[styles.content, { color: "#fff" }]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut rhoncus,
            quam in lacinia gravida, ante quam varius sapien, eu egestas magna
            elit sit amet dui. Nullam cursus et nisi faucibus molestie. Mauris
            viverra mauris eu urna convallis scelerisque. Duis a elementum
            tellus. In sed lobortis nunc. Praesent ullamcorper luctus eros eu
            venenatis. Maecenas vel tincidunt lacus, at fringilla velit. Vivamus
            semper malesuada elit nec tempus. Pellentesque mollis nibh ut
            pretium dapibus. Morbi hendrerit risus eu risus dapibus, a finibus
            mi elementum. Suspendisse et elit quis justo vestibulum scelerisque
            sed eu libero. Nulla eros sem, vehicula id faucibus in, hendrerit eu
            eros. Praesent bibendum accumsan erat, ut facilisis nulla tempus at.
            Suspendisse potenti.
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
            color="#0F992E"
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
        <Pressable
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
            backgroundColor: "#0F992E",
            marginLeft: "4%",
            transform: [{ scale: submitPressed ? 0.95 : 1 }],
          }}
          onPress={handleSubmit}
          onPressIn={handleSubmitPressIn}
          onPressOut={handleSubmitPressOut}
        >
          <Text style={{ color: "white", fontSize: 12 }}>Submit</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
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
  dropdownContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "white", // Background color of the dropdown container
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
  dropdown: {
    olor: "gray",
  },

  placeholderStyle: {
    fontSize: 12,
    color: "white",
  },
  selectedTextStyle: {
    fontSize: 12,
    color: "gray",
  },

  inputSearchStyle: {
    fontSize: 12,
    color: "white",
  },
});