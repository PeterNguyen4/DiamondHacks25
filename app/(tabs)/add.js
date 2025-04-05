import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

export default function App() {
    const sendData = async (data) => {
        try {
          const response = await axios.get(`http://100.83.61.208:3001/test/${data}`);
          Alert.alert("Success", response.data);
        } catch (error) {
          console.error("Error sending data:", error);
          Alert.alert("Error", "Failed to send data to server");
        }
    };
    const [permission, requestPermission] = useCameraPermissions();
    
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
        {/* <Link href={'/home'} asChild> */}
            <CameraView style={styles.camera} type='back' onBarcodeScanned={async (scanned) => {
                console.log('!!!BARCODE ID:', scanned.data)
                sendData(scanned.data)
            }}>
            </CameraView>
        {/* </Link> */}
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
