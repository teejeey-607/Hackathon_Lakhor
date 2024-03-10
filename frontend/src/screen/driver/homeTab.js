import {
    StyleSheet,
    Text,
    Modal ,
    Button,
    View,
    StatusBar,
    Image,
    Pressable,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Alert,
    ToastAndroid,
    Platform,
    ActivityIndicator
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import Ionicons from "@expo/vector-icons/Ionicons";
  import axios from "axios";
  import config from "../../../config";
  import * as SecureStore from 'expo-secure-store';
  import { useFocusEffect } from '@react-navigation/native';


  import * as Location from 'expo-location';
  
  const DATA = [
    //   {
    //     id: "1",
    //     source: require("../../../assets/image/deleteItLater.jpg"),
    //     destination: "Thimphu",
    //   },
      {
        id: "2",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Paro",
      },
      {
        id: "3",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Punakha",
      },
      {
        id: "4",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Wangdue Phodrang",
      },
      {
        id: "5",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Haa",
      },
      {
        id: "6",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Gasa",
      },
      {
        id: "7",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Trongsa",
      },
      {
        id: "8",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Bumthang",
      },
      {
        id: "9",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Zhemgang",
      },
      {
        id: "10",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Mongar",
      },
      {
        id: "11",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Lhuentse",
      },
      {
        id: "12",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Trashigang",
      },
      {
        id: "13",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Trashiyangtse",
      },
      {
        id: "14",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Samdrup Jongkhar",
      },
      {
        id: "15",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Pemagatshel",
      },
      {
        id: "16",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Samtse",
      },
      {
        id: "17",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Chukha",
      },
      {
        id: "18",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Dagana",
      },
      {
        id: "19",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Tsirang",
      },
      {
        id: "20",
        source: require("../../../assets/image/deleteItLater.jpg"),
        destination: "Sarpang",
      },
    ];

  export default function DriverHome({navigation }) {
    const [selectedRoute, setSelectedRoute] = useState("local"); // 'local' or 'longDistance'
    const [selectedItem, setSelectedItem] = useState(null);
    const [localRoutes, setLocalRoutes] = useState([]);

    const [cid, setCid] = useState(null);
    const [vehiclecapacity, setVehiclecapacity] = useState(null);
    const [vehicletype, setVehicletype] = useState(null);
    const [vehiclenumber, setVehiclenumber] = useState(null);
    const [mobilenumber, setMobilenumber] = useState(null);
    const [vehiclebrand,setVehiclebrand]=useState(null);
    const[vehiclecolor,setVehiclecolor]=useState(null)

    const [name, setName] = useState(null);
    const [prevLatitude, setPrevLatitude] = useState(null);
    const [prevLongitude, setPrevLongitude] = useState(null);
    const [loading, setLoading] = useState(true);

    // Inside your component function
    useFocusEffect(
      React.useCallback(() => {
        // Fetch updated ride requests when the screen gains focus
        fetchLocalRoutes();
      }, [])
    );

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch driver information from SecureStore
          const formDataString = await SecureStore.getItemAsync('formData');
          const formData = JSON.parse(formDataString);
          setCid(formData.cid);
          setName(formData.name);
          setVehiclenumber(formData.vehiclenumber);
          setMobilenumber(formData.mobilenumber);
          setVehiclebrand(formData.vehiclebrand);
          setVehiclecolor(formData.vehiclecolor);
          
          setVehiclecapacity(formData.vehiclecapacity);
          setVehicletype(formData.vehicletype);
      
          
        } catch (error) {
          console.error('Error fetching data from SecureStore', error);
        }
      };
  
      fetchData();
    }, []);


  const [drivecurrentLocation, setDriverCurrentLocation] = useState(null);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAO-yhc-jkEdIiPLYN5y74ok88EhBrQRVc';

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
  
      if (status === 'granted') {
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
  
        if (initialLocation && initialLocation.coords) {
          setDriverCurrentLocation(initialLocation.coords);
        } else {
          console.error('Error: Unable to get current location.');
        }
      } else {
        // Redirect to a different page to show location disabled message
        navigation.navigate('LocationDisabledPage');
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      // Redirect to a different page to show location disabled message
      navigation.navigate('LocationDisabledPage');
    }
  };

    useEffect(() => {
      // Fetch data from the backend when the component mounts
      fetchLocalRoutes();
    }, []);
  
    const fetchLocalRoutes = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/routerequest`);
        const data = response.data;
        // Filter out the items you want to hide (e.g., items with a certain attribute)
        const visibleRoutes = data.filter(item => !item.hidden);
        setLocalRoutes(visibleRoutes);
      } catch (error) {
        console.error('Error fetching local routes:', error);
      }
    };

    const handleHide = (item) => {
      const message = `Do you want to remove this request?\nPickup: ${item.pickupnote}\nDestination: ${item.destination}\nFare: 200`;
    
      Alert.alert(
        "Remove request Confirmation",
        message,
        [
          {
            text: "Yes",
            onPress: () => handleConfirmation(item.id),
            style: "destructive",
          },
          {
            text: "Cancel",
            onPress: () => handleCancelConfirmation(),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    };

    const handleConfirmation = async (itemId) => {
      try {
     // Call the delete function with the item ID
        await deleteItem(itemId);
      } catch (error) {
          console.error('Error deleting item:', error);
        }
    };
          
    const handleCancelConfirmation = () => {
      // Close the confirmation modal without deleting the item
    };
        
    const deleteItem = async (id) => {
      // console.log(id)
      try {
        // Call the backend API to delete the item
        await axios.delete(`${config.API_URL}/api/localroute/${id}`);
              
        // Once deleted successfully, update the local data
        setLocalRoutes(prevRoutes => prevRoutes.filter(item => item.id !== id));
              
      } catch (error) {
          console.error('Error deleting item:', error);
            // Handle error (e.g., show error message to user)
          }
        };

useEffect(() => {
  const saveDriverLocation = async (latitude, longitude) => {
    try {
      const response = await axios.post(`${config.API_URL}/api/insertLocation`, {
        driver_id: cid,
        name:name,
        vehiclenumber:vehiclenumber,
        mobilenumber:mobilenumber,
        vehicletype: vehicletype,
        vehiclecapacity:vehiclecapacity,
        vehiclebrand:vehiclebrand,
        vehiclecolor:vehiclecolor,
        latitude: latitude,
        longitude: longitude

      });
      // console.log('Driver location saved successfully:', response.data);
    } catch (error) {
      
    }
  };

  const updateDriverLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      while (!location || !location.coords || !location.coords.latitude || !location.coords.longitude) {
        console.log('Waiting for valid location...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        location = await Location.getCurrentPositionAsync({});
      }

      const { latitude, longitude } = location.coords;
      if (latitude !== prevLatitude || longitude !== prevLongitude) {
        setPrevLatitude(latitude);
        setPrevLongitude(longitude);
        saveDriverLocation(latitude, longitude);
        // console.log('Latitude and longitude have been updated:', latitude, longitude);
      }
    } catch (error) {
      console.error('Error updating driver location:', error);
    } finally {
      setLoading(false); // Stop showing loading indicator
    }
  };

  updateDriverLocation();
  const interval = setInterval(updateDriverLocation, 1000);
  return () => clearInterval(interval);
}, [cid, vehicletype, vehiclecapacity, prevLatitude, prevLongitude]);

    StatusBar.setBackgroundColor("#0F992E");
    StatusBar.setBarStyle("light-content");
  
    const [cancelPressed, setCancelPressed] = useState(false);
    const [selectPressed, setSelectPressed] = useState(false);
  
    const handleCancelPressIn = () => {
      setCancelPressed(true);
    };
  
    const handleCancelPressOut = () => {
      setCancelPressed(false);
    };
  
    const handleSelectPressIn = () => {
      setSelectPressed(true);
    };
  
    const handleSelectPressOut = () => {
      setSelectPressed(false);
    };
    const [submitPressed, setSubmitPressed] = useState(false);
  
    const handleSubmitPressIn = () => {
      setSubmitPressed(true);
    };
  
    const handleSubmitPressOut = () => {
      setSubmitPressed(false);
    };
  
    // const openConfirmationAlert = (item) => {
    //   Alert.alert(
    //     "Ride Confirmation",
    //     `Are you sure you want to create a ride? Destination: ${item.destination}`,
    //     [
    //       {
    //         text: "Yes",
    //         onPress: () => createRideFn(item), // Pass a function reference
    //         style: "destructive", // This will make the button orange
    //       },
    //       {
    //         text: "Cancel",
    //         style: "cancel",
    //       },
    //     ],
    //     { cancelable: false }
    //   );
    // };
  
    const showToast = (message) => {
      if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        Alert.alert(message);
      }
    };
  
    // const createRideFn = async (item) => {
    //   try {
    //     // Assuming you have the necessary data to send in the request body
    //     const response = await axios.post(`${config.API_URL}/api/ride`, {
    //       //create ride
    //       destination: item.destination,
    //       pickup_point: "Thimphu",
    //       driver: 10906000123, //get the drive id from redux or async storage
    //       ride_type: "LD",
    //       ride_status: "pending",
    //     });
  
    //     //   console.log("Ride creation successful:", response.data);
    //   } catch (error) {
    //     if (error.response && error.response.status === 400) {
    //       console.log("Ride already exists");
    //       showToast("Ride already exists");
    //     } else {
    //       // Handle other errors
    //       console.log("Error creating ride:", error);
    //     }
    //   } finally {
    //     // Redirect to the next screen after successful ride creation
    //     navigation.navigate("select_ld", { destination: item.destination });
    //   }
    // };
  
    const renderItem = ({ item }) => (
      <Pressable
        style={styles.imageContainer}
        onPress={() => navigation.navigate("select_ld", { destination: item.destination })}
      >
        <Image source={item.source} style={styles.image} />
        <View style={styles.overlay}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                alignItems: "flex-start",
                paddingLeft: "10%",
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: 500 }}>
                {item.destination}
              </Text>
              <Text style={{ fontSize: 7 }}>Pick Up Point: Changlimithang</Text>
            </View>
            <View
              style={{
                width: "50%",
                alignItems: "flex-end",
                paddingRight: "10%",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View>
                  {/* <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      paddingRight: "5%",
                      justifyContent: "center",
                      marginTop: 5,
                    }}
                  >
                    5
                  </Text> */}
                </View>
                {/* <View style={{ justifyContent: "center" }}>
                  <Image
                    source={require("../../../assets/image/taxi.png")}
                    style={{ resizeMode: "contain", height: 25, width: 25 }}
                  />
                </View> */}
              </View>
              {/* <Text style={{ fontSize: 8, marginTop: -5, fontWeight: 500 }}>
                Drivers
              </Text> */}
            </View>
          </View>
        </View>
      </Pressable>
    );
  
    return (
      
      

      <View style={{ flex: 1, backgroundColor: "white" }}>
          {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
        <View style={styles.head}>
          <View style={styles.text}>
            <Text style={{ fontSize: 14, fontWeight: "700" }}>
              Get a Passenger Now!
            </Text>
            <Text style={{ fontSize: 12, width: "80%" }}>
              No matter where you're headed, we'll make sure you reach your
              destination.
            </Text>
          </View>
          <View>
            <View style={styles.drive}>
              <View style={styles.route}>
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: "#4A4A4A" }}
                >
                  Today, I am going to drive
                </Text>
                <View style={{ flexDirection: "row", marginTop: "3%" }}>
                  {/* local */}
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      selectedRoute === "local" ? styles.activeTab : {},
                    ]}
                    onPress={() => setSelectedRoute("local")}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#4A4A4A",
                      }}
                    >
                      Local Route
                    </Text>
                    <Ionicons
                      name="location"
                      size={25}
                      color="#F50C0C"
                      style={{ marginTop: "5%", zIndex: 5 }}
                    />
                    <Image
                      style={{
                        width: "50%",
                        resizeMode: "contain",
                        top: "-15%",
                        height: 15,
                      }}
                      source={require("../../../assets/image/Ellipse.png")}
                    />
                  </TouchableOpacity>
                  {/* long distance */}
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      selectedRoute === "longDistance" ? styles.activeTab : {},
                    ]}
                    onPress={() => setSelectedRoute("longDistance")}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#4A4A4A",
                      }}
                    >
                      Long Distance
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Ionicons
                        name="location"
                        size={25}
                        color="#F50C0C"
                        style={{ marginTop: "5%" }}
                      />
                      <View style={{justifyContent:'center'}}>
                      <Text
                        style={{
                          textAlignVertical: "center",
                          paddingHorizontal: 5,
                        }}
                      >
                        ..........
                      </Text>
                      </View>
                      <Ionicons
                        name="location"
                        size={25}
                        color="#4C7A95"
                        style={{ marginTop: "5%" }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Content based on selected route */}
        {selectedRoute === 'local' && (
            <View style={{marginTop:'15%'}}>       
                <Text style={{ fontSize: 14,fontWeight:600,marginHorizontal:'12%' }}>
                    Available Ride Request</Text>
                        
                        <View style={{height:"77%"}}>
                            
                            <View style={styles.locals}>

                                <FlatList
                                  data={localRoutes}
                                  keyExtractor={(item) => (item.id ? item.id.toString() : null)}
                                  renderItem={({ item }) => (
                                    // Render only visible items
                                    !item.hidden && (

                                      <View style={{ flexDirection: 'row', borderWidth:1, borderColor:'white' }}>
                                        <View style={{ backgroundColor: "#D9D9D9", flex: 1 }}>
                                          <View style={{ marginHorizontal: '20%', paddingVertical: '3%' }}>
                                            <Text style={{ fontSize: 12, fontWeight: 600 }}>From:</Text>
                                            <Text style={{ fontSize: 12 }}>{`${item.pickupnote}`}</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                              <View>
                                                <Text style={{ fontSize: 12, fontWeight: 600, marginTop: '5%' }}>To</Text>
                                                <Text style={{ fontSize: 12 }}>{`${item.destination}`}</Text>
                                                
                                              </View>
                                              <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', width: '65%' }}>
                                                <Text style={{ fontSize: 14, fontWeight: 700 }}>{`Nu.200`}</Text>
                                              </View>
                                            </View>
                                          </View>
                                        </View>

                                        <Pressable
                                          onPress={() => handleHide(item)}
                                          style={{
                                            width: '20%',
                                            backgroundColor: cancelPressed ? '#3a3a3a' : '#535353',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}
                                        >
                                          <Text style={{ fontSize: 12, fontWeight: 500, color: 'white' }}>Cancel</Text>
                                        </Pressable>

                                        <Pressable
                                          onPress={() =>
                                            navigation.navigate('selectlocal', {
                                              id:item.id,
                                              cid: item.cid,
                                              name: item.name,
                                              pickupnote: item.pickupnote,
                                              destination: item.destination,
                                              pessengercurrentlocation: item.currentlocation,
                                              time:item.time,
                                              numberofpassenger:item.numberofpassenger,
                                              mobilenumber:item.mobilenumber,
                                              type:item.type,
                                              drivercurrentLocation:drivecurrentLocation
                                
                                            })
                                          }
                                          style={{
                                            width: '20%',
                                            backgroundColor: selectPressed ? '#0c7d2f' : '#0F992E',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}
                                        >
                                          <Text style={{ fontSize: 12, fontWeight: 500, color: 'white' }}>Select</Text>
                                        </Pressable>
                                      </View>

                                      
                                    )
                                  )}
                                />
                      </View>
                  
                </View>
              </View>
          )}
        {selectedRoute === "longDistance" && (
          <View style={{ marginTop: "15%" }}>
            <Text
              style={{ fontSize: 14, fontWeight: 600, marginHorizontal: "8%" }}
            >
              For long distance, today i am going to:
            </Text>
            <View style={{ marginHorizontal: "8%", marginTop: "5%" }}>
              <FlatList
                style={{ height: 306 }}
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.container}
              />
  
              <View style={{ flexDirection: "row", marginTop: "6%" }}>
                <Pressable
                  style={{
                    ...styles.btn,
                    backgroundColor: "#2E3E31",
                    marginRight: "2%",
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
                    marginLeft: "2%",
                    transform: [{ scale: submitPressed ? 0.95 : 1 }],
                  }}
                  onPress={() => navigation.navigate("SelectedLocal")}
                  onPressIn={handleSubmitPressIn}
                  onPressOut={handleSubmitPressOut}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>Confirm</Text>
                </Pressable>
              </View>
            </View>
            <View></View>
          </View>
        )}
      </View>
    );
  }
  const styles = StyleSheet.create({
    head: {
      backgroundColor: "#0F992E",
      height: "32%",
    },
    text: {
      paddingHorizontal: "8%",
      marginTop: "17%",
    },
    drive: {
      marginTop: "10%",
      marginHorizontal: "6%",
      backgroundColor: "white",
      borderRadius: 10,
      zIndex: 5,
      paddingBottom: "5%",
    },
    route: {
      paddingHorizontal: "6%",
      marginTop: "5%",
    },
    tab: {
      width: "49%",
      borderRadius: 8,
      alignItems: "center",
      paddingVertical: "3%",
      marginHorizontal: "0.5%",
      borderWidth: 1,
      borderColor: "#E1E1E1",
    },
    activeTab: {
      backgroundColor: "#E5E5E5",
      borderColor: "#B3B3B3",
    },
    locals: {
      flexDirection: "row",
      marginTop: "1%",
    },
    container: {
      justifyContent: "flex-start",
    },
    imageContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 1,
      height: 100, // Adjust this value for desired image aspect ratio
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    overlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "35%", // Adjust this value to control the height of the overlay
      backgroundColor: "rgba(255, 255, 255, 0.7)", // Translucent white
      justifyContent: "center",
      alignItems: "center",
    },
    btn: {
      width: "48%",
      alignItems: "center",
      paddingVertical: "4%",
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1, // Ensure the overlay is above other elements
    },
  });