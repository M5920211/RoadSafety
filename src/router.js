import React, { Component } from 'react';
import { Scene, Router, ActionConst } from 'react-native-router-flux';
import {
  Dimensions,
  Image,
  Platform,
  Linking,
  StatusBar,
  StyleSheet,
  NetInfo,
  Text,
  BackHandler,
  View,
  TouchableOpacity,
} from 'react-native';

import CheckLogin from './components/auth/CheckLogin';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Question from './components/question/Question';
import Main from './components/main/Main';
import TestDrive from './components/main/TestDrive';
import Sensor from './components/main/Sensor';
import Report from './components/report/Report';
import ReportDetail from './components/report/ReportDetail';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';

class RouterComponent extends Component {

  render() {
    const tabIcon = (obj) => {
    const focused = obj.focused;
    const key = obj.navigation.state.key
    switch (key) {
      case 'questionTabBar':
        if (focused) {
          return(
            <View style={styles.center}>
              <Image source={require('./images/tab1_at.png')} style={styles.tabButtonIcon}/>
            </View>
          );
        } else {
          return(
            <View style={styles.center}>
              <Image source={require('./images/tab1.png')} style={styles.tabButtonIcon}/>
            </View>
          );
        }
      case 'mainTabBar':
        if (focused) {
          return(
            <View style={styles.center}>
              <Image source={require('./images/tab2_at.png')} style={styles.tabButtonIcon}/>
            </View>
          );
        } else {
          return(
            <View style={styles.center}>
              <Image source={require('./images/tab2.png')} style={styles.tabButtonIcon}/>
            </View>
          );
        }
      case 'reportTabBar':
        if (focused) {
          return(
            <View style={styles.center}>
              <Image source={require('./images/tab3_at.png')} style={styles.tabButtonIcon}/>
            </View>
          );
        } else {
          return(
            <View style={styles.center}>
              <Image source={require('./images/tab3.png')} style={styles.tabButtonIcon}/>
            </View>
          );
        }
      case 'profileTabBar':
        if (focused) {
          return(
            <View style={styles.center}>
              <Image source={require('./images/tab4_at.png')} style={styles.tabButtonIcon}/>
            </View>
          );
        } else {
          return(
            <View style={styles.center}>
              <Image source={require('./images/tab4.png')} style={styles.tabButtonIcon}/>
            </View>
          );
        }
    }
  }

    return (
      <Router>
        <Scene key="root">
          <Scene key="checkLogin" component={CheckLogin} title="CheckLogin" hideNavBar initial />
          <Scene key="login" component={Login} title="Login" type={ActionConst.RESET} hideNavBar />
          <Scene key="register" component={Register} title="Register" hideNavBar />

          <Scene key="tabbar" animationEnabled={false}  tabs={true} tabBarStyle={styles.footer} showLabel={false} tabBarPosition={'bottom'} lazy={true} swipeEnabled={false}>
            <Scene key="questionTabBar" icon={tabIcon} initial="initial">
              <Scene key="question" component={Question} hideNavBar={true} hideHeader={false}/>
            </Scene>
            <Scene key="mainTabBar" icon={tabIcon} >
              <Scene key="main" component={Main} hideNavBar={true} hideHeader={false}/>
              <Scene key="testDrive" component={TestDrive} hideNavBar={true} hideHeader={false}/>
              <Scene key="sensor" component={Sensor} hideNavBar={true} hideHeader={false}/>
            </Scene>
            <Scene key="reportTabBar" icon={tabIcon} >
              <Scene key="report" hideNavBar="true" component={Report} hideHeader={false}/>
              <Scene key="reportDetail" hideNavBar="true" component={ReportDetail} hideHeader={false}/>
            </Scene>
            <Scene key="profileTabBar" icon={tabIcon} >
              <Scene key="profile" component={Profile} hideNavBar={true} hideHeader={false}/>
              <Scene key="editProfile" component={EditProfile} hideNavBar={true} hideHeader={false}/>
            </Scene>
          </Scene>

      </Scene>
    </Router>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03BE9C',
    borderTopWidth: 0,
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowOpacity: 0,
    elevation: 0,
    paddingTop: 2
  },
  tabButtonIcon: {
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
})



export default RouterComponent;
