// SuccessAlert.js
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';

const ConfirmDriverSuccess = ({ visible,message ,navigation}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Image style={styles.payment} source={require('../../../assets/image/success.png')} />
                    <Text style={styles.modalText}>Sonam Wangyel</Text>
                    <Text style={{fontSize:10,marginTop:5}}>has confirmed your request.</Text>
                    <Text style={{fontSize:10,marginTop:5}}>Estimation time <Text style={{fontWeight:'bold'}}>15 </Text>mins to reach you</Text>

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
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        backgroundColor: '#FBD3A8',
        borderRadius: 5,
        paddingBottom:50,
        paddingHorizontal: 50,
        alignItems: 'center',
        elevation: 5,
        width:'90%'
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
    payment:{
        marginTop:'20%',
        height:100,
        width:100,
        resizeMode: "contain",
    }
});

export default ConfirmDriverSuccess;
