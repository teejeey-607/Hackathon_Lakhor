// SuccessAlert.js
import React from 'react';
import { Modal, View, Text, StyleSheet,Image ,Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window');
const SuccessAlert = ({ visible,message ,navigation}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Image style={styles.payment} source={require('../../../assets/image/success.png')} />
                    <Text style={styles.modalText}>{message}</Text>
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
        width:width/1.2,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingBottom:40,
        paddingHorizontal: 40,
        alignItems: 'center',
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 12
    },
    closeButton: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical:10,
        borderRadius: 5,
        backgroundColor: '#D9D9D9'
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

export default SuccessAlert;
