import React, { useState} from 'react';
import { StyleSheet, Text, View, StatusBar, Pressable,FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const currentRide = [

  {
    key: '1',
    pickupLocation: '1Clock Tower, Behind ZamZam Restaurantttt',
    destinationLocation: 'Clock Tower, Zam Zam Restaurant',
  },

  {
    key: '2',
    pickupLocation: '2Clock Tower, Behind ZamZam Restaurant',
    destinationLocation: 'Clock Tower, Zam Zam Restaurant',
  },
  {
    key: '3',
    pickupLocation: '3somewhere',
    destinationLocation: 'someone',
  },
  {
    key: '4',
    pickupLocation: '4Clock Tower, Behind ZamZam Restaurantttt',
    destinationLocation: 'Clock Tower, Zam Zam Restaurant',
  },

  {
    key: '5',
    pickupLocation: '5Clock Tower, Behind ZamZam Restaurant',
    destinationLocation: 'Clock Tower, Zam Zam Restaurant',
  },
  {
    key: '6',
    pickupLocation: '6somewhere',
    destinationLocation: 'someone',
  },
  

];

const pastRide = [
  {
    key: '1',
    pickupLocation: '16Clock Tower, Behind ZamZam Restaurantttt',
    destinationLocation: 'Clock Tower, Zam Zam Restaurant',
    date: '2024-01-16', // Add the date property with the desired date format
  },
  {
    key: '2',
    pickupLocation: '16Clock Tower, Behind ZamZam Restaurant',
    destinationLocation: 'Clock Tower, Zam Zam Restaurant',
    date: '2024-01-16', // Add the date property with the desired date format
  },
  {
    key: '3',
    pickupLocation: '17somewhere',
    destinationLocation: 'someone',
    date: '2024-01-17', // Add the date property with the desired date format
  },
  {
    key: '4',
    pickupLocation: '17Clock Tower, Behind ZamZam Restaurantttt',
    destinationLocation: 'Clock Tower, Zam Zam Restaurant',
    date: '2024-01-17', // Add the date property with the desired date format
  },
  {
    key: '5',
    pickupLocation: '18Clock Tower, Behind ZamZam Restaurant',
    destinationLocation: 'Clock Tower, Zam Zam Restaurant',
    date: '2024-01-18', // Add the date property with the desired date format
  },
  {
    key: '6',
    pickupLocation: '18somewhere',
    destinationLocation: 'someone',
    date: '2024-01-18', // Add the date property with the desired date format
  },
];


export default function PassengerRide({navigation}) {
  StatusBar.setBackgroundColor('transparent');
  StatusBar.setBarStyle('dark-content');
  
  const [currentRides, setCurrentRides] = useState(true);

  const toggleRides = () => {
    setCurrentRides(!currentRides);
  };
  const sortedPastRide = [...pastRide].sort((a, b) => new Date(b.date) - new Date(a.date));

  let lastDate = null;

  const renderItem = ({ item }) => {
    const truncateText = (text, maxLength) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
  
    const truncatedPickupLocation = truncateText(item.pickupLocation, 35);
    const truncatedDestinationLocation = truncateText(item.destinationLocation, 35);
  
    return (
      <View>
      <Pressable style={{ marginHorizontal: '8%', padding: 13, backgroundColor: '#F4F4F4', borderRadius: 5,marginBottom:5 }}
      onPress={() => navigation.navigate('currentRideDetails')}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ height: 15, width: 15, backgroundColor: '#D9D9D9', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ height: 8, width: 8, backgroundColor: '#878787', borderRadius: 100 }}></View>
            </View>
          </View>
          <View style={{ width: '88%', paddingHorizontal: '5%' }}>
            <Text style={{ fontSize: 10, fontWeight: 700 }}>{truncatedPickupLocation}</Text>
            <Text style={{ fontSize: 10, color: '#6D6D6D',marginTop:5 }}>Pickup Location</Text>
          </View>
        </View>
  
        {/* <View style={{ paddingLeft: 39, marginTop: 32, position: 'absolute', transform: [{ rotate: '90deg' }] }}>
          <Text>......</Text>
        </View> */}
  
        <View style={{ flexDirection: 'row', marginTop: '10%' }}>
          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="location" size={18} color="red"style={{ marginTop: '5%' }} />
          </View>
          <View style={{ width: '88%', paddingHorizontal: '5%' }}>
            <Text style={{ fontSize: 10, fontWeight: 700 }}>{truncatedDestinationLocation}</Text>
            <Text style={{ fontSize: 10, color: '#6D6D6D',marginTop:5 }}>Destination Location</Text>
          </View>
        </View>
      </Pressable>
      <View style={{paddingVertical:5}}>
        
      </View>
      </View>
    );
  };
  
  const renderPastRide = ({ item }) => {
 
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const truncatedPickupLocation = truncateText(item.pickupLocation, 35);
  const truncatedDestinationLocation = truncateText(item.destinationLocation, 35);

  return (
    <View>
      {/* Only render the date view if the current date is different from the last date */}
      {item.date !== lastDate && (
        <View style={{ backgroundColor: '#F4F4F4' }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: '#333',
              paddingHorizontal: '8%',
              paddingVertical: 5,
            }}>
            {item.date}
          </Text>
        </View>
      )}
      <Pressable style={{ marginHorizontal: '8%', padding: 13, backgroundColor: '#F4F4F4', borderRadius: 5, marginBottom: 5,marginTop:12 }}
      onPress={() => navigation.navigate('pastRideDetails')}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ height: 15, width: 15, backgroundColor: '#D9D9D9', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ height: 8, width: 8, backgroundColor: '#878787', borderRadius: 100 }}></View>
            </View>
          </View>
          <View style={{ width: '88%', paddingHorizontal: '5%' }}>
            <Text style={{ fontSize: 10, fontWeight: 700 }}>{truncatedPickupLocation}</Text>
            <Text style={{ fontSize: 10, color: '#6D6D6D',marginTop:5 }}>Pickup Location</Text>
          </View>
        </View>

        {/* <View style={{ paddingLeft: 39, marginTop: 32, position: 'absolute', transform: [{ rotate: '90deg' }] }}>
          <Text>......</Text>
        </View> */}

        <View style={{ flexDirection: 'row', marginTop: '10%' }}>
          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="location" size={18} color="red" style={{ marginTop: '5%' }} />
          </View>
          <View style={{ width: '88%', paddingHorizontal: '5%' }}>
            <Text style={{ fontSize: 10, fontWeight: 700 }}>{truncatedDestinationLocation}</Text>
            <Text style={{ fontSize: 10, color: '#6D6D6D',marginTop:5 }}>Destination Location</Text>
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
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Ionicons name="car" size={24} color="#535353" />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ color: '#535353', fontSize: 15, fontWeight: '600', paddingLeft: 10 }}>
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
              backgroundColor: currentRides ? '#FF6B00' : 'transparent',
            }}
            onPress={toggleRides}
          >
            <Text style={{fontWeight:500,fontSize:12, color: currentRides ? 'white' : '#535353' }} onPress={toggleRides}>
              Current Rides
            </Text>
          </Pressable>
          <Pressable
            style={{
              ...styles.toggle,
              backgroundColor: currentRides ? 'transparent' : '#FF6B00',
            }}
            onPress={toggleRides}
          >
            <Text style={{fontWeight:500,fontSize:12, color: currentRides ? '#535353' : 'white' }} onPress={toggleRides}>
              Past Rides
            </Text>
          </Pressable>
        </View>
      </View>
      {/* Render content based on the selected toggle */}
      <View>
        {currentRides ? (
              <FlatList
              style={{height:'85%',paddingTop:10,marginBottom:10}}
              data={currentRide}
              renderItem={renderItem}
              keyExtractor={item => item.key}
              showsVerticalScrollIndicator={false} 
            />
        ) : (
          
          <FlatList
          style={{height:'85%',marginBottom:10}}
          data={sortedPastRide}
          renderItem={renderPastRide}
          keyExtractor={item => item.key}
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
    backgroundColor: 'white',
  },
  header: {
    marginTop: 40,
    paddingHorizontal: '8%',
  },
  rideCat: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    marginTop: 10,
  },
  toggle: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  contentContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#535353',
  },
});
