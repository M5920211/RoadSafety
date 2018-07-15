import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

const {width, height} = Dimensions.get('window');

class Profile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: null,
      email: null,
      mobile: null,
      countTrip: 0,
      avgTotalSpeed: 0,
      totalDistance: 0,
      totalDuration: 0,
      totalCountSpeedLimit: 0,
      countBreak:0,
    }
  }

  componentDidMount(){
    const { currentUser } = firebase.auth();
    const data = firebase.database().ref(`/users/${currentUser.uid}`);
    data.on('value', snapshot => {
      let data = snapshot.val();
      let items = Object.values(data);
      this.setState({
        name: items[0].firstName + ' ' + items[0].lastName,
        email: items[0].email,
        mobile: items[0].mobile,
      })
    });

    const total = firebase.database().ref(`/users/${currentUser.uid}/totalTrip`);
    total.on('value', (snapshot) => {
      let data = snapshot.val();
      let items = Object.values(data);
      this.setState({
        avgTotalSpeed: items[0],
        countAlert: items[1],
        countBreak: items[2],
        countTrip: items[3],
        totalCountSpeedLimit: items[4],
        totalDistance: items[5],
        totalDuration: items[6],
      })
    });

  }

  logout(){
    Alert.alert(
      'Would you like to logout?',
      '',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          firebase.auth().signOut();
          Actions.login();
        }},
      ],
      { cancelable: false }
    )
  }
  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <StatusBar backgroundColor="#03BE9C" barStyle="light-content"/>
            <Body style={styles.navigationTitle}>
              <Title style={styles.title}>Profile</Title>
            </Body>
        </Header>
        <Content>
          <View style = {{flexDirection: 'column', padding: 10,}}>
            <View style = {{flexDirection: 'row', height: 50, margin: 2, alignItems: 'center'}}>
              <View style = {{padding: 10, width: '20%'}}>
                <Text>Name</Text>
              </View>
              <View style = {{padding: 10, backgroundColor: '#85C1E9', width: '80%', borderRadius: 20}}>
                <Text>{this.state.name}</Text>
              </View>
            </View>
            <View style = {{flexDirection: 'row', height: 50, margin: 2, alignItems: 'center'}}>
              <View style = {{padding: 10, width: '20%'}}>
                <Text>E-mail</Text>
              </View>
              <View style = {{padding: 10, backgroundColor: '#85C1E9', width: '80%', borderRadius: 20}}>
                <Text>{this.state.email}</Text>
              </View>
            </View>
            <View style = {{flexDirection: 'row', height: 50, margin: 2, alignItems: 'center'}}>
              <View style = {{padding: 10, width: '20%'}}>
                <Text>Mobile</Text>
              </View>
              <View style = {{padding: 10, backgroundColor: '#85C1E9', width: '80%', borderRadius: 20}}>
                <Text>{this.state.mobile}</Text>
              </View>
            </View>
            <TouchableOpacity style = {{alignItems: 'center', justifyContent: 'center', backgroundColor: '#C4D1CB', width: '100%', borderRadius: 5, height: 50}} onPress = {()=>Actions.editProfile()}>
              <Text>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style = {{marginHorizontal: 10, paddingHorizontal: 20, paddingTop: 5, borderRadius: 10, backgroundColor: '#C1E0F1'}}>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>จำนวนการทดสอบทั้งหมด</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>{this.state.countTrip} ครั้ง</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>ความเร็วเฉลี่ย</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>{this.state.avgTotalSpeed} km/hr.</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>ระยะทางเฉลี่ย</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>{this.state.totalDistance} km.</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>เวลาเฉลี่ย</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>{this.state.totalDuration} hr.</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>จำนวนการเตือน</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>{this.state.countAlert} ครั้ง</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>จำนวนการเบรก</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 2}}>
                <Text>{this.state.countBreak} ครั้ง</Text>
              </View>
            </View>

          </View>


          <TouchableOpacity activeOpacity={0.8} onPress={ () => this.logout() }>
            <View style = {styles.box_menu2}>
              <Image
                source={require('../../images/logout.png') }
                style={styles.icon_logout}
              />
              <Text style = {styles.text_menu}>Logout</Text>
            </View>
          </TouchableOpacity>

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#03BE9C',
    borderBottomWidth: 0,
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowOpacity: 0,
    elevation: 0,
    height: 44,
    paddingTop: -10
  },
  title: {
    fontFamily: Platform.OS == 'ios'
      ? 'SukhumvitSet-Medium'
      : 'sukhumvitset-medium',
    fontSize: 20,
    color: '#FFFFFF'
  },
  navigationTitle: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon_logout: {
    width: 40,
    height: 40,
  },
  box_menu2: {
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default Profile;
