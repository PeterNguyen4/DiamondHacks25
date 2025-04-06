import { useState, useEffect, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, View, AppState } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const sendData = async (data) => {
    try {
      const response = await axios.get(`http://100.83.61.208:3001/test/${data}`);
      Alert.alert("Success", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
      Alert.alert("Error", "Failed to send data to server");
    }
};

export default function App() {
    const router = useRouter();
    const scannerState = useRef(false);
    const appState = useRef(AppState.currentState);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (event) => {
        if (event === "active" && appState.current.match(/inactive|background/)) {
            scannerState.current = false;
        }
        appState.current = event;
    });

    return () => {
        subscription.remove();
    };
    }, []);
    
    if (!permission) {
    return <View />;
    }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <CameraView style={styles.camera} type='back' onBarcodeScanned={async (barcodeData) => {
                if (barcodeData && !scannerState.current) {
                    scannerState.current = true;
                    console.log('!!!BARCODE ID:', barcodeData.data)
                    sendData(barcodeData.data)
                    router.push('/home')
                }
            }} 
        /> 
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    }
});
