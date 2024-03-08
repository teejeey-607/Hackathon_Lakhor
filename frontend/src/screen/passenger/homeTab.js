import { StyleSheet, Text, View,Alert,TextInput,StatusBar,Image,Pressable, ActivityIndicator,Modal,
  ScrollView,FlatList,Dimensions,TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import React,{useEffect,useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ImageBackground } from 'react-native';



import * as Location from 'expo-location';
import axios from 'axios';

import config from '../../../config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LocalPickUp from './localPickUp';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
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
      destination: "Wangdue",
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

// Custom Alert Component
const CustomAlert = ({ message, visible, onClose }) => {
  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
      <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
        {message}
        <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
          <Text style={{ color: 'blue', fontSize: 16 }}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default function PassengerHome({ navigation }){
    StatusBar.setBackgroundColor('#FBD3A8');
    StatusBar.setBarStyle('dark-content');



  const [pickupPoint, setPickupPoint] = useState('');
  const [destination, setDestination] = useState('');
  console.log(destination)
  const [loading, setLoading] = useState(true);

  const destinations = ['gcit', 'cit Bus parking', 'Taba', 'Dechencholing', 'Babesa', 'Kabesa'];
  const [showDropdown, setShowDropdown] = useState(false);

  const [suggestions, setSuggestions] = useState([]);



  const filterDestinations = (text) => {
    const filteredDestinations = destinations.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    return filteredDestinations;
  };

  const handleDestinationSelect = (selectedDestination) => {
    setDestination(selectedDestination);
    setShowDropdown(false);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAO-yhc-jkEdIiPLYN5y74ok88EhBrQRVc';

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

 



  
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (initialLocation && initialLocation.coords) {
          setCurrentLocation(initialLocation.coords);
          setLoading(false); // Set loading to false once location data is available
        } else {
          console.error('Error: Unable to get current location.');
          setLoading(false); // Set loading to false if unable to get location
        }
      } else {
        // Redirect to a different page to show location disabled message
        navigation.navigate('LocationDisabledPage');
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      setLoading(false); // Set loading to false if there's an error
      // Redirect to a different page to show location disabled message
      navigation.navigate('LocationDisabledPage');
    }
  };





const handleCommon = async (type) => {
    try {
   
      navigation.navigate('MapPage', {
        currentLocation: currentLocation,
        destination: destination,
        type: type,
      });
    } catch (error) {
      console.error('Error reversing:', error);
    }
  };
  
  const handleReverse = async () => {
    // Use the common function with type "reverse"
    if (!destination) {
      // showAlert('Please enter your Destination.');
      showAlertComponent(<Text style={{fontSize:14}}>Please enter your Destination.</Text>);
    } else {
      
      await handleCommon('reverse');
    }
   
  };
  const message='Please enter your Destination.'
  
  const handleShare = async () => {
    // Use the common function with type "share"
    if (!destination) {
      // showAlert(`${<Text style={{fontSize:14}}>message</Text>}`);
      showAlertComponent(<Text style={{fontSize:14}}>Please enter your Destination.</Text>);
    } else {
    
      await handleCommon('share');
    }
  };





  const showAlertComponent = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  
  


    const renderLongDistance= ({ item }) => (
        <Pressable style={styles.imageContainer} onPress={() => navigation.navigate('CD_LD', { destination: item.destination })}>
        <Image source={item.source} style={styles.image} />
        <View style={styles.overlay}>
            <View style={{flexDirection:'row'}}>
                <View style={{width:'50%',alignItems:'flex-start',paddingLeft:'10%'}}>
                    <Text style={{fontSize:10,fontWeight:500}}>{item.destination}</Text>
                    <Text style={{fontSize:7}}>Pick Up Point: 
                        Changlimithang
                    </Text>
                </View>
                <View style={{width:'50%',alignItems:'flex-end',paddingRight:'10%'}}>
                    
                        <View style={{justifyContent:'center',alignItems:'center',width:'50%'}}>
                            <Image  source={require('../../../assets/image/taxi.png')} style={{resizeMode: 'contain',height:25,width:25}}/>
                        </View>
                    
                    {/* <Text style={{fontSize:8,marginTop:-5,fontWeight:500}}> 5 Drivers
                    </Text> */}
                </View>
            
            </View>
            
        </View>
        </Pressable>
    );


    return (
        <ImageBackground style={[styles.overlay1, loading && styles.loadingBackground]} source={require('../../../assets/image/bg.png')}
        resizeMode='contain'>
           <CustomAlert
                  message={alertMessage}
                  visible={showAlert}
                  onClose={handleCloseAlert}
                />



   
           {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
        </View>
      )}
    
 
        
        <View style={styles.head}>
            <View style={styles.text}>
                <View style={{width:'68%'}}>
                    <Text style={{ fontSize: 14, fontWeight:'bold',fontFamily:'Roboto' }}>Get A Taxi Now!</Text>
                    <Text style={{ fontSize:11,marginTop:4,fontWeight:400,fontFamily:'Roboto',lineHeight:20}}>
                    No matter where you're headed, we'll make sure you reach your destination.
                    </Text>
                </View>
                <View style={{top:'20%',zIndex:2}} >
                <Image  source={require('../../../assets/image/taxi.png')} style={{resizeMode: 'contain',height:70,width:100}}/>
                </View>
            </View>
        <View>
            <View style={styles.drive}>
            <View style={styles.route}>
            <Text style={{fontSize:12,fontFamily:'Roboto',marginTop:'5%',fontWeight:'700',letterSpacing:1}}>Where you want to go?</Text>
          
             
             
            

            <View style={styles.inputContainer}>
              
                  <Ionicons name="location" size={25} color="red" style={styles.icon} />
                  <TextInput
          style={styles.input}
          placeholder="Enter Your Destination"
          value={destination}
          onFocus={() => setShowDropdown(true)} // Show dropdown on focus
          onChangeText={(text) => {
            setDestination(text);
            setShowDropdown(true);
          }}
        />
        {showDropdown && (
          <TouchableOpacity style={styles.closeIcon} onPress={handleCloseDropdown}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        )}
         {showDropdown && (
        <View style={styles.dropdown}>
          
          <ScrollView  style={{ height:150,
    marginHorizontal: 20,}}>
          {filterDestinations(destination).map((item, index) => (
            <TouchableOpacity
                  
              key={index}
              style={styles.dropdownItem}
              onPress={() => handleDestinationSelect(item)}>

                <Text>{item}</Text>
            
            </TouchableOpacity>
          ))}
            </ScrollView>
        </View>
      )}  
     
      
     

      
  
                   

                  
              </View>
          
 
     

        </View>
            </View>
           

        </View>


        </View>
      
    
         <View style={{marginTop:70}}>
               
                <View  style={{flexDirection:'row',width:'89%',height:130,marginTop:40,marginLeft:20}}>
                  <TouchableOpacity
                  style={styles.rscontainer}
                    onPress={handleReverse}>
                    <View  >
                        <Image  source={require('../../../assets/image/reserved.png')} style={{resizeMode: 'contain',height:100,width:150,marginTop:-35}}/>
                        <Text style={styles.text1}>Reserved</Text>   
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rscontainer} onPress={handleShare} >
                    <View >
                        <Image  source={require('../../../assets/image/sharing.png')} style={{resizeMode: 'contain',height:100,width:150,marginTop:-35}}/>
                        <Text style={styles.text1}>Sharing</Text> 
                    </View>

                    </TouchableOpacity>
                   
                </View>
             
                <View>
                <Text style={{paddingHorizontal:'10%',fontSize: 14, fontWeight:'bold',fontFamily:'Roboto',color:'#4A4A4A',marginTop:25}}>
                  Pre-Defined Destinations
                  </Text>
                <FlatList
                nestedScrollEnabled={true}
                    style={{height:250,paddingHorizontal:'6%',marginTop:10,marginBottom:40}}
                    data={DATA}
                    renderItem={renderLongDistance}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.itemContainer}
                    // showsHorizontalScrollIndicator={false}
                    
   
                    />
                </View>
               
               
        </View>  
     
 
     
    </ImageBackground>
    )
}
const styles = StyleSheet.create({
    head:{
        backgroundColor:'#FBD3A8',
        height:200
    },
    text:{
        paddingHorizontal:'8%',
        marginTop:'17%',
        flexDirection:'row'
    },
    drive:{
     
        marginHorizontal:"6%",
        borderRadius:10,

    },
    route:{
        paddingHorizontal:'5%',
       
        backgroundColor:'white',
        height:'80%',
        borderRadius:10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5, // for Android
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
     
        width:'88%',
        paddingLeft:'5%'
    },
        input: {
        flex: 1,
        fontSize:12,
        padding:8,
        borderWidth:1,
    },
        searchButton: {
        paddingVertical: '1%',
        borderWidth:1,
        borderColor:'#0F992E'

        },
        searchButtonContent: {
        alignItems: 'center',
        justifyContent: 'center',
        },
        prefer:{
        width:'50%',
        alignItems:'center',

        },
        preferText:{
        color:'white',
        fontSize:12,
        fontWeight:'500',
        paddingVertical:5
        
        },
        itemContainer:{
        justifyContent:'flex-start',
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        height: 100, // Adjust this value for desired image aspect ratio
        position: 'relative', 
    },
    image: {
        width: '100%',
        height: "100%",
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '35%', // Adjust this value to control the height of the overlay
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Translucent white
        justifyContent: 'center',
        alignItems: 'center',
    },
    // loadingContainer: {
    //   position: 'absolute',
    //   top: '50%',
    //   left: '50%',
    //   zIndex:2,
    //   transform: [{ translateX: -25 }, { translateY: -25 }], // Adjust according to your ActivityIndicator size
    // },

    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1, // Ensure the overlay is above other elements
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#888',
    
      borderRadius: 5,
      paddingHorizontal: 10,
      marginTop:5,
      shadowColor: 'rgba(0, 0, 0, 0.02)',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 5, // for Android
      borderWidth: 1,
      borderColor: 'rgba(27, 31, 35, 0.15)',
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 40,
    },
    rscontainer:{
       backgroundColor:'white',
       width:'49%',
       alignItems:'center',
       height:130,
       padding:10,
       marginLeft:2,
       marginRight:2,
       borderRadius:10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5, // for Android
        },

        text1: {
          marginTop:5, // Adjust the margin as needed
          fontSize:14, // Adjust the font size as needed
          fontWeight:'bold',
          letterSpacing:1,
          textAlign:'center'
          // Add more text styling as needed
        },
        overlay1: {
          flex:1,
          backgroundColor:'white'
          // Adjust opacity here
        },
        dropdown: {
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
        
          zIndex: 2,
         // Adjust the maxHeight as needed
        },
        
        dropdownContent: {
          flexGrow: 1,
        },
        dropdownItem: {
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        },
        loadingBackground: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
        },
    

})