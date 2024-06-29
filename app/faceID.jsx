import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState("back");
  const cameraRef = useRef(null);

  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  const navigation = useNavigation();
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const imageBase64 = data.base64;

    axios.post('http://192.168.1.5:5000/upload', {
        image: imageBase64,
      })
      .then(function (response) {
        axios.get(`http://192.168.1.5:5000/check_role/${response.data}`)
        .then(function (response) {
        const role = response.data.role;
     if (role === 'worker') {
        console.log(response.data);
        navigation.navigate("QR", { data: response.data });
        // Предполагается, что у вас есть страница QRScan
    } else if (role === 'manager') {
        navigation.navigate("map");
      // Оставить пользователя на текущей странице или выполнить другое действие
    }
})
.catch(function (error) {
  console.log(error);
});
      
  })
  .catch(function (error) {
    console.log(error);
  });
    }
  };
  

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} type={type} ref={cameraRef}  facing={facing}>
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      
    </View>

    
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });