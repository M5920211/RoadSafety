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
  TextInput
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content,  } from 'native-base';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

const {width, height} = Dimensions.get('window');

class EditProfile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      mobile: null,
      question: null,
    }
  }

  componentDidMount(){
    const { currentUser } = firebase.auth();
    const data = firebase.database().ref(`/users/${currentUser.uid}/history`);
    data.on('value', snapshot => {
      snapshot.forEach((child) => {
        this.setState({
          firstName: child.val().firstName == 'null' ? null : child.val().firstName,
          lastName: child.val().lastName == 'null' ? null : child.val().lastName,
          email: child.val().email == 'null' ? null : child.val().email,
          mobile: child.val().mobile == 'null' ? null : child.val().mobile,
          question: child.val().question,
        })
      });
    });
  }

  onSave(){
    const { currentUser } = firebase.auth();
    const history = firebase.database().ref(`/users/${currentUser.uid}/history`);
    history.update({
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      mobile: this.state.mobile,
      question: this.state.question,
    }).then(() => {
      Alert.alert(
        'Save data success',
        '',
        [
          {text: 'OK', onPress: () => {
            Actions.pop({
              refresh: {refresh:Math.random()}
            });
          }},
        ],
      );
    });
  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <StatusBar backgroundColor="#03BE9C" barStyle="light-content"/>
            <Left>
             <Button onPress = {() => Actions.pop({refresh: {refresh:Math.random()}})} transparent>
               <Icon name='arrow-back' />
             </Button>
            </Left>
            <Body style={styles.navigationTitle}>
              <Title style={styles.title}>Edit Profile</Title>
            </Body>
            <Right />
        </Header>
        <Content>
        <View style = {{flexDirection: 'column', padding: 10,}}>
          <View style = {{flexDirection: 'row', height: 50, margin: 3, alignItems: 'center'}}>
            <View style = {{padding: 10, width: '30%'}}>
              <Text>First name</Text>
            </View>
            <View style = {{padding: 10, backgroundColor: '#85C1E9', width: '70%', borderRadius: 20}}>
              <TextInput
                placeholder='First name'
                value={this.state.firstName}
                onChangeText={firstName => this.setState({ firstName })}
                style={{padding: 3}}
                underlineColorAndroid="transparent"
                keyboardType={'default'}
              />
            </View>
          </View>
          <View style = {{flexDirection: 'row', height: 50, margin: 3, alignItems: 'center'}}>
            <View style = {{padding: 10, width: '30%'}}>
              <Text>Last name</Text>
            </View>
            <View style = {{padding: 10, backgroundColor: '#85C1E9', width: '70%', borderRadius: 20}}>
              <TextInput
                placeholder='Last name'
                value={this.state.lastName}
                onChangeText={lastName => this.setState({ lastName })}
                style={{padding: 3}}
                underlineColorAndroid="transparent"
                keyboardType={'default'}
              />
            </View>
          </View>
          <View style = {{flexDirection: 'row', height: 50, margin: 3, alignItems: 'center'}}>
            <View style = {{padding: 10, width: '30%'}}>
              <Text>E-mail</Text>
            </View>
            <View style = {{padding: 10, backgroundColor: '#85C1E9', width: '70%', borderRadius: 20}}>
            <TextInput
              placeholder='Email'
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              style = {{padding: 3}}
              underlineColorAndroid="transparent"
              keyboardType={'email-address'}
              editable={false}
              selectTextOnFocus={false}
            />
            </View>
          </View>
          <View style = {{flexDirection: 'row', height: 50, margin: 3, alignItems: 'center'}}>
            <View style = {{padding: 10, width: '30%'}}>
              <Text>Mobile</Text>
            </View>
            <View style = {{padding: 10, backgroundColor: '#85C1E9', width: '70%', borderRadius: 20}}>
              <TextInput
                placeholder='Mobile'
                value={this.state.mobile}
                onChangeText={mobile => this.setState({ mobile })}
                style = {{padding: 3}}
                underlineColorAndroid="transparent"
                keyboardType={'default'}
              />
            </View>
          </View>
          <TouchableOpacity style = {{alignItems: 'center', justifyContent: 'center', backgroundColor: '#C4D1CB', width: '100%', borderRadius: 5, height: 50, marginVertical: 20}} onPress = {()=>this.onSave()}>
            <Text>Save</Text>
          </TouchableOpacity>
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

export default EditProfile;
