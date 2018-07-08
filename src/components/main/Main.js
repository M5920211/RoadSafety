import React, {Component} from 'react';
import geolib from 'geolib';
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
  TextInput,
  PermissionsAndroid
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content } from 'native-base';
import MapView, { ProviderPropType, Marker, AnimatedRegion } from 'react-native-maps';
import prompt from 'react-native-prompt-android';
import { Actions } from 'react-native-router-flux';
import haversine from 'haversine';
import RunInfo from './run-info';
import RunInfoNumeric from './run-numeric';
import firebase from 'firebase';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
const { width, height } = Dimensions.get('window');
let id = 0;
export default class Main extends Component {
  constructor(props) {
      super(props);

      this.state = {
        region: {
          latitude: 13.811278,
          longitude: 100.553876,
          latitudeDelta: 0.02, //วงกว้างจากละติจูด
          longitudeDelta: 0.02,//วงกล้างจากลองจิจูด
        },
      };
    }

    componentWillMount() {

    }

    componentWillReceiveProps(){
        this.setState({car: null, maxSpeed: null});
    }

    componentWillUnmount(){

    }

    onSelect(index, value){
      this.setState({car: value});
    }

    async checkPermission(){
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Location Permission',
            'message': 'This App needs access to your location '
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the Location")
          Actions.testDrive({
            car: this.state.car,
            maxSpeed: this.state.maxSpeed,
          })
        } else {
          alert("Location permission denied");
        }
      } catch (err) {
        console.warn(err)
      }
    }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <StatusBar backgroundColor="#03BE9C" barStyle="light-content"/>
            <Body style={styles.navigationTitle}>
              <Title style={styles.title}>Drive</Title>
            </Body>
        </Header>
        <Content>
        {/*<View style={styles.container}>
            <MapView
              style={styles.map}
              showsUserLocation = {true}
              initialRegion={this.state.region}
            >
            </MapView>
        </View>*/}
        <Image
          source={require('../../images/car.png') }
          style={{width: 250, height: 200, alignSelf: 'center'}}
        />
        <View style = {{flexDirection: 'column', justifyContent: 'center', padding: 20}}>
        <Text style = {{fontSize: 18}}>ประเภทรถ</Text>
        <RadioGroup
          onSelect = {(index, value) => this.onSelect(index, value)}
        >
          <RadioButton value={'รถยนต์'} >
            <Text>รถยนต์</Text>
          </RadioButton>
          <RadioButton value={'รถจักรยานยนต์'}>
            <Text>รถจักรยานยนต์</Text>
          </RadioButton>
        </RadioGroup>
        <Text style = {{fontSize: 18}}>ความเร็วที่กำหนด</Text>
        <TextInput
          placeholder='ความเร็วที่กำหนด'
          value={this.state.maxSpeed}
          onChangeText={maxSpeed => this.setState({ maxSpeed })}
          style={styles.textbox}
          underlineColorAndroid="transparent"
          keyboardType={'numeric'}
        />
          <Button
            style = {styles.buttonTime}
            onPress = {() => { Actions.testDrive({
              car: this.state.car,
              maxSpeed: this.state.maxSpeed,
            })}}
          >
            <Text>Start</Text>
          </Button>
        </View>
        </Content>
      </Container>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      // ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      height: '70%',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
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
    infoWrapper:{
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      flexDirection: 'column',
      flex: 1,
    },
    buttonTime: {
      marginTop: 50,
      width: '90%',
      borderRadius: 10,
      justifyContent: 'center',
      backgroundColor: '#FED922',
      alignSelf: 'center'
    },
    textbox: {
     fontFamily: 'TrueMedium',
     backgroundColor: '#ffffff',
     // borderWidth: 1,
     borderRadius: 10,
     color: '#444444',
     width: '50%',
     height: 50,
     paddingLeft: 20,
     marginTop: 10,
     // shadowColor: '#000',
     // shadowOffset: { width: 0, height: 5 },
     // shadowOpacity: 0.8,
     // shadowRadius: 2,
     // elevation: 1,
    },
  });
