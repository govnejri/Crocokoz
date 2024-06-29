import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Pressable, Link } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

const Start = () => {
  const [fontLoaded] = useFonts({
    'BalooBhai': require('C:\\Users\\bekan\\Downloads\\NewApp\\assets\\fonts\\BalooBhai.ttf'),
    'BeVietnamPro-Black': require('C:\\Users\\bekan\\Downloads\\NewApp\\assets\\fonts\\BeVietnamPro-Black.ttf'),
  });
  const FaceID = require('C:\\Users\\bekan\\Downloads\\NewApp\\assets\\images\\FaceID.png')
  
  const navigation = useNavigation();
  const navigateToFaceID = () => {
    navigation.navigate("faceID"); // Use the correct screen name here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Face Detection</Text>
      <Image source={ FaceID} style={styles.image} />
      <Text style={styles.scanText}>please prepare for facial scan</Text>
      <TouchableOpacity style={styles.button} onPress={navigateToFaceID}>
        <LinearGradient colors={['#26308A', '#141B58']} style={styles.gradient}>
          <Text style={styles.buttonText}>Start</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Start

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
    marginBottom: 30,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  scanText: {
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    height: 50,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    textDecorationStyle: 'bold',
    color: 'white',
    fontSize: 20,
  },
})