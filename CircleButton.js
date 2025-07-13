import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function CircleButton({ color = 'black', onPress, label }){
    return (
        <TouchableOpacity
        onPress = {onPress}
        style = {[styles.button, { backgroundColor: color }]}
        activeOpacity = {0.7}
        >
            <Text style = {[styles.text, { color: color === 'black' ? 'white' : 'black' }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: screenWidth/2,
        height: screenWidth/2,
        borderRadius: screenWidth/4,
        justifyContent: 'center',
        alignItems: 'center',
        margin: screenWidth/12,
        borderWidth: screenWidth/72,
        borderColor: '#C5C5C5',
        backgroundColor: 'transparent',
    },
    text: {
        fontWeight: 'bold',
        fontSize: screenWidth/12,
    },
});
