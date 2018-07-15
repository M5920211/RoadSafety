import React from 'react';
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

class ReportDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: null,
      email: null,
      avgSpeed: null,
      carType: null,
      countSpeedLimits: null,
      distance: null,
      duration: null,
      maxSpeed: null,
      countBreak: null,
      alert: null,
    }
  }

  componentDidMount(){
    const { currentUser } = firebase.auth();
    const data = firebase.database().ref(`/users/${currentUser.uid}/trip/${this.props.keyId}`);
    data.on('value', snapshot => {
      snapshot.forEach((child) => {
        console.log(child.key);
        console.log(child.val());
        if(child.key == 'avgSpeed'){
          this.setState({
            avgSpeed: child.val(),
          })
        }
        if(child.key == 'carType'){
          this.setState({
            carType: child.val(),
          })
        }
        if(child.key == 'countSpeedLimits'){
          this.setState({
            countSpeedLimits: child.val(),
          })
        }
        if(child.key == 'distance'){
          this.setState({
            distance: child.val(),
          })
        }
        if(child.key == 'duration'){
          this.setState({
            duration: child.val(),
          })
        }
        if(child.key == 'maxSpeed'){
          this.setState({
            maxSpeed: child.val(),
          })
        }
        if(child.key == 'alert'){
          this.setState({
            alert: child.val(),
          })
        }
        if(child.key == 'countBreak'){
          this.setState({
            countBreak: child.val(),
          })
        }

      });
    });
  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <StatusBar backgroundColor="#03BE9C" barStyle="light-content"/>
            <Left>
              <TouchableOpacity onPress = {() => Actions.pop()}>
                <Image
                  source={require('../../images/close.png') }
                  style={{ width: 20, height: 20}}
                />
              </TouchableOpacity>
            </Left>
            <Body style={styles.navigationTitle}>
              <Title style={styles.title}>Report Detail</Title>
            </Body>
        </Header>
        <Content>
          <View style = {{borderColor: 'red', borderWidth: 1, height: 250, width: '90%', alignSelf: 'center', margin: 10}}>
          </View>
          <View style = {{marginHorizontal: 10, padding: 10, borderRadius: 10}}>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>ประเภทรถ</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>{this.state.carType}</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>ความเร็วเฉลี่ย</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>{this.state.avgSpeed} km/hr.</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>ระยะทาง</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>{this.state.distance} km.</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>เวลา</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>{this.state.duration} hr.</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>ความเร็วที่กำหนด</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>{this.state.maxSpeed} km/hr.</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>จำนวนการเตือน</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>{this.state.alert} ครั้ง</Text>
              </View>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>จำนวนการเบรก</Text>
              </View>
              <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                <Text>{this.state.countBreak} ครั้ง</Text>
              </View>
            </View>

          </View>
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

export default ReportDetail;
