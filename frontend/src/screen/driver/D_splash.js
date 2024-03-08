// SuccessAlert.js
import React from 'react';
import { Modal, View, StyleSheet,Image } from 'react-native';

const DriverSplash = ({ visible,message ,navigation}) => {

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.centeredView}>
                <View >
                <Image style={styles.bg} source={require('../../../assets/image/bg.png')} />
                <Image style={styles.logo} source={require('../../../assets/image/logo.png')} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#22873E'
    },
    modalText: {
        marginTop:5,
        textAlign: 'center',
        fontSize: 12,
        fontWeight:'500'
    },

    closeButtonText: {
        color: 'black',
        fontSize: 13,

    },
    bg:{
        width:350,
        resizeMode: "contain",
        alignSelf:'center'
    },
    logo:{
        resizeMode:'contain',
        width:190,
        alignSelf:'center',
        position:'absolute',
        marginTop:150

    }
});

export default DriverSplash;
