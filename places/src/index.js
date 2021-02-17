import React, { Component } from 'react'
import {
  Text, StyleSheet, View, TouchableOpacity, PermissionsAndroid,
  Platform
} from 'react-native'
import RNGooglePlaces, { GMSTypes } from 'react-native-google-places';
import { openSettings, check, PERMISSIONS } from 'react-native-permissions';
import { showLocation } from 'react-native-map-link';
import Geolocation from '@react-native-community/geolocation';

export default class App extends Component {

  componentDidMount() {
    RNGooglePlaces.getAutocompletePredictions('mumbai')
      .then((results) => {
        console.log(results)
      })
      .catch((error) => console.log(error.message));
  }

  getLocation = () => {
    return new Promise((resolve, reject) => {
      console.log('inside getlocation');
      Geolocation.getCurrentPosition(
        //Will give the current location
        position => {
          console.log('position ::::' + position);
          const currentLongitude = JSON.stringify(position.coords.longitude);
          //getting the Longitude from the location json
          const currentLatitude = JSON.stringify(position.coords.latitude);
          const location = currentLatitude + ',' + currentLongitude;
          console.log('location::::' + location);
          resolve(location);
        },
        error => reject(error),
        // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    });
  };

  getCurrentLocation = async () => {
    console.log('inside  getCurrentLocation');
    const that = this;
    if (Platform.OS === 'ios') {
      that.getLocation()
        .then((location) => {
          that.getLatLon(location);
        })
        .catch(err => {
          console.log('Permission Denied');
          that.checkIfPermissionDenied();
        });
    } else {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          console.log('granted:::::' + granted);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permission granted');
            //To Check, If Permission is granted
            that.getLocation().then((location) => {
              that.getLatLon(location);
            });
          } else {
            console.log('Permission Denied');
            that.checkIfPermissionDenied();
          }
        } catch (err) {
          console.log(err);
          Alert.alert(
            'Error',
            that.props.content.data.drugPricingRoute.locationError,
          );
        }
      }
      requestLocationPermission();
    }
  };

  checkIfPermissionDenied = async () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    try {
      check(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE ||
          PERMISSIONS.IOS.LOCATION_ALWAYS,
      ).then(res => {
        console.log(res);
        if (res === 'granted') {

        } else {
          console.log('Permission Denied');
          that.showPermissionDeniedAlert();
        }
      });
    } catch (error) {
      console.log('location set error:', error);
    }
  };

  showPermissionDeniedAlert = () => {
    Alert.alert(
      'Info',
      'Permission Denied',
      [
        {
          text: 'Go To settings',
          onPress: () => {
            openSettings();
          },
        },
        {
          text: 'Cancel',
          onPress: () => {
          },
        },
      ],
      { cancelable: false },
    );
  };

  getLatLon = (locationCord) => {
    const myArray = locationCord.split(',');
    console.log('Latitude:::', myArray[0]);
    console.log('Longitude:::', myArray[1]);
    Alert.alert(
      'Latitude:::' + myArray[0],
      'Longitude:::' + myArray[1],

    );
  };

  showDirections = () => {
    const endtLoc = { latitude: 19.077065, longitude: 72.998993 };
    const startLoc = { latitude: 19.0953, longitude: 73.0007 };
    const options = {
      latitude: 19.0953,
      longitude: 73.0007,
      sourceLatitude: 19.077065,  // optionally specify starting location for directions
      sourceLongitude: 72.998993,
    };
    showLocation(options);
  };

  render() {

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.showDirections();
          }}>
          <Text> Show Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.getCurrentLocation();
          }}>
          <Text> Get Location</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({})
