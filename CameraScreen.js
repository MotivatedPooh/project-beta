import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64';

import { HF_API_KEY } from '../config';

const screenWidth = Dimensions.get('window').width;

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState(''); // Store result here

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const classifyImage = async (photo) => {
    setLoading(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const rawBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      const response = await fetch(
        'https://api-inference.huggingface.co/models/google/vit-base-patch16-224',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/octet-stream',
          },
          body: rawBytes,
        }
      );

      const text = await response.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Raw response:', text);
        throw new Error('Received non-JSON response from API.');
      }

      if (Array.isArray(result) && result.length > 0) {
        const topN = 2; // number of top predictions to use
        const predictionsToSpeak = result.slice(0, topN);

        const speechText = predictionsToSpeak
          .map(pred => {
            const label = pred.label;
            const confidence = (pred.score * 100).toFixed(0);
            return `${label}, ${confidence} percent confidence`;
          })
          .join('. ') + '.';

        setResultText(speechText);
        Speech.speak(speechText);
      } else {
        setResultText('Could not identify the image.');
        Speech.speak('Could not identify the image.');
      }
    } catch (err) {
      console.error(err);
      setResultText('Error: ' + err.message);
      Speech.speak('An error occurred');
    } finally {
      setLoading(false);
    }
  };






  const handleScan = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Captured image:', photo.uri);

      await classifyImage(photo);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={{ color: 'white' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />

      <TouchableOpacity style={styles.scanButton} onPress={handleScan} disabled={loading}>
        <Text style={styles.scanText}>{loading ? 'Scanning...' : 'SCAN'}</Text>
      </TouchableOpacity>

      {/* Result text displayed here */}
      <View style={styles.resultContainer}>
        <Text
          accessible={true}
          accessibilityLiveRegion="polite"
          style={styles.resultText}
          importantForAccessibility="yes"
        >
          {resultText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  scanButton: {
    position: 'absolute',
    bottom: screenWidth / 6,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: screenWidth / 4,
    padding: screenWidth / 10,
  },
  scanText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: screenWidth / 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resultContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#00000088',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resultText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
