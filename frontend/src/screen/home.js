import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,TextInput} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function HomeScreen({navigation}) {
    return (
    <View style={styles.mainContainer}>

    <Image style={styles.dragon}  source={require('../../assets/image/bg.png')}
            />
    <Image style={styles.welcome}  source={require('../../assets/image/welcome.png')}
            />
    <Text style={styles.text}>Welcome to</Text>
    <Image style={styles.logo}  source={require('../../assets/image/logo.png')}
        />
    <View style={styles.role}>
        
        <TouchableOpacity style={styles.passenger} onPress={()=>navigation.navigate('Passenger')}>
        <View style={styles.center}>
        <Ionicons name="md-person" size={96} color="white" />
            <Text style={{color:"white",fontWeight:"600"}}> PASSENGER</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.driver} onPress={()=>navigation.navigate('Driver')} >
        <View style={styles.center}>
        <AntDesign  color="white" name="car" size={96} />
            <Text style={{color:"white",fontWeight:"600"}}> DRIVER</Text>
        </View>
        </TouchableOpacity>
    </View>
    </View>
    );
}
const styles = StyleSheet.create({
    mainContainer:{
        flex: 1, 
        alignItems: 'center', 
        backgroundColor:'white'

    },
    dragon: {
        marginTop:"20%",
        width:"95%",
        resizeMode:"contain"

    },
    welcome: {
    position:"absolute",
    marginTop:"36%",
    width:"60%",
    resizeMode:"contain"
    },
    logo:{
        width:"55%",
        resizeMode:"contain",
        height:'10%'
    },
    text:{
        marginTop:"15%",
        fontWeight:"800",
        fontSize:18
    },
    role:{
        flexDirection:"row",
        marginTop:"10%",
        color:"white"
    },
    passenger:{
        width:"50%",
        alignItems:"center",
        backgroundColor:"#F17012",
        padding:"5%",

    },
    driver:{
        width:"50%",
        alignItems:"center",
        backgroundColor:"#22873E",
        padding:"5%",

    },
    center:{
        alignItems:"center"
    }
    
})  