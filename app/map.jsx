import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
        },
      );
      setSubscription(sub);
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      {location ? (
  <MapView
    style={styles.map}
    initialRegion={{
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  >
    <Marker
      coordinate={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }}
      title="Madiyar_Khasanov"
      description="Here I am"
    />
    <Marker
      coordinate={{
        latitude: location.coords.latitude + 0.0000014,
        longitude: location.coords.longitude,
      }}
      title="Konstantin_Koshevoy"
      description="Worker"
    />
    <Marker
      coordinate={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude + 0.000011,
      }}
      title="Abdulla_Auezkhan"
      description="Worker"
    />
    <Marker
      coordinate={{
        latitude: location.coords.latitude + 0.0000012,
        longitude: location.coords.longitude + 0.000001,
      }}
      title="Asylkhan_Abdulgapar"
      description="Worker"
    />
  </MapView>
) : (
        <Text>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '80%',
    height: '80%',
  },
});

export default App;
