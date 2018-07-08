/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import firebase from 'firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  componentDidMount() {
    alert('hi')
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
        alert('true')
      } else {
        firebase.auth().signInWithEmailAndPassword('email@test.com', 'password')
        .catch((signInError) => {
          const signInErrorDetail = `code: ${signInError.code}
          message: ${signInError.message}`;
          alert(signInErrorDetail);
          firebase.auth().createUserWithEmailAndPassword('email@test.com', 'password')
            .catch((signUpError) => {
              const signUpErrorDetail = `code: ${signUpError.code}
              message: ${signUpError.message}`;
              alert(signUpErrorDetail);
            });
        });
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>

        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
