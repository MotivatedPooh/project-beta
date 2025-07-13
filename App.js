import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Urbanist_700Bold } from '@expo-google-fonts/urbanist';
import AppLoading from 'expo-app-loading'; // install if you don't have it
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CameraScreen from './screens/CameraScreen';
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Urbanist_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Project Beta">
        <Stack.Screen
          name="Project Beta"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
