import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function CameraButton({ label, onPress, color, backgroundColor }) {
  const isDark = backgroundColor === 'black';

  const shadowStyle = {
    shadowColor: isDark ? '#fff' : '#000',
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  };

  return (
    <View style={shadowStyle}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          {
            borderColor: '#C5C5C5',
            backgroundColor: backgroundColor,
          },
        ]}
        activeOpacity={0.75}
      >
        <Text style={[styles.text, { color, fontFamily: 'Urbanist_700Bold' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: screenWidth / 2,
    height: screenWidth / 2,
    borderRadius: screenWidth / 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: screenWidth / 12,
    borderWidth: screenWidth / 72,
  },
  text: {
    fontWeight: 'bold',
    fontSize: screenWidth / 12,
  },
});
