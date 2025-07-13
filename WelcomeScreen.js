import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CircleButton from '../components/CircleButton';

export default function WelcomeScreen({ navigation }) {
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('themeColor');
        if (savedColor) {
          setDarkMode(savedColor === 'black');
        }
      } catch (e) {
        console.error('Failed to load theme color', e);
      }
    };
    loadTheme();
  }, []);

  const handleThemeSelection = async (color) => {
    try {
      await AsyncStorage.setItem('themeColor', color);
      setDarkMode(color === 'black');
    } catch (e) {
      console.error('Failed to save theme color', e);
    }
  };

  // Dynamic style for drop shadow color
  const shadowStyle = {
    shadowColor: isDarkMode ? '#fff' : '#000',
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? 'black' : 'white' },
      ]}
    >
      <View
        style={[
          styles.buttonGroup,
          {
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 40,
          },
        ]}
      >
        <View style={shadowStyle}>
          <CircleButton
            color="black"
            label="DARK"
            onPress={async () => {
              await handleThemeSelection('black');
              navigation.replace('Home');
            }}
          />
        </View>
        <View style={[shadowStyle, { marginTop: 20 }]}>
          <CircleButton
            color="white"
            label="LIGHT"
            onPress={async () => {
              await handleThemeSelection('white');
              navigation.replace('Home');
            }}
          />
        </View>
      </View>

      <Text
        style={[
          styles.welcomeText,
          {
            color: isDarkMode ? 'white' : 'black',
            textAlign: 'center',
          },
        ]}
      >
        {'Welcome to Project Beta.\nChoose your starting theme.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGroup: {
    marginBottom: 50,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 100,
    fontWeight: '700',
    fontFamily: 'Urbanist_700Bold',
  },
});
