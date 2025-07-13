import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import CameraButton from '../components/CameraButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [themeColor, setThemeColor] = useState('white');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const color = await AsyncStorage.getItem('themeColor');
        if (color) setThemeColor(color);
      } catch (e) {
        console.error('Failed to load theme color', e);
      }
    };
    loadTheme();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      <CameraButton
        color={themeColor === 'black' ? 'white' : 'black'}
        backgroundColor={themeColor}
        label="CAMERA"
        onPress={() => navigation.navigate('Camera')}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
