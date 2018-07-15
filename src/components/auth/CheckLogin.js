
import React, { Component } from 'react';
import firebase from 'firebase';
import { Image, StyleSheet, View, AsyncStorage, ActivityIndicator, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

class CheckLogin extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.disableYellowBox = true
    const config = {
      apiKey: "AIzaSyAQhpz4KsAagfkmwKvXQzSexlaCUu0qbAQ",
      authDomain: "roadsafety-4ffb1.firebaseapp.com",
      databaseURL: "https://roadsafety-4ffb1.firebaseio.com",
      projectId: "roadsafety-4ffb1",
      storageBucket: "roadsafety-4ffb1.appspot.com",
      messagingSenderId: "874342410807"
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          const { currentUser } = firebase.auth();
          try {
           AsyncStorage.setItem('uid:key', currentUser.uid);
           Actions.tabbar({type: 'reset'});
          } catch (error) {
            console.log(error);
          }
        } else {
          Actions.login({type: 'reset'});

        }
      });
    }

  render() {
    return (
      <View style={styles.spinnerStyle}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CheckLogin;
