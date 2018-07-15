
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Alert, AppRegistry, StyleSheet, View ,Text,TextInput, Image, TouchableOpacity} from 'react-native';
import FBSDK, {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
import firebase from 'firebase';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '',error: '' };
  }

  componentDidMount() {}

  goMenu(){
    Actions.tabbar({type: 'reset'});
  }

  onLogin(){

      const { email, password } = this.state;
      this.setState({ error: '' });
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.goMenu.bind(this))
      .catch((signInError) => {
          Alert.alert('ไม่ถูกต้อง');
        });
    }

    onLoginFacebook(){
      LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email'])
      .then(
        (result) => {
          if (result.isCancelled) {
            Alert.alert('Whoops!', 'You cancelled the sign in.');
          } else {
            AccessToken.getCurrentAccessToken()
              .then((data) => {
                let accessToken = data.accessToken
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                firebase.auth().signInWithCredential(credential)
                  .then(() => {
                    const { currentUser } = firebase.auth();
                    this.dataFacebook(accessToken);
                }).catch((error) => {
                    console.log(error.message);
                });

              });
          }
        },
        (error) => {
          Alert.alert('Sign in error', error.error);
        },
      );
    }

    dataFacebook(accessToken){
      const responseInfoCallback = (error, result) => {
        if (error) {
            Alert.alert("LOGIN WITH FACEBOOK FAIL")
        } else {
          console.log(result);
          const { currentUser } = firebase.auth();
          const dataHistory = firebase.database().ref(`/users/${currentUser.uid}/history`);
          dataHistory.on('value', (snapshot) => {
                let data = snapshot.val();
                if (data == null) {
                  dataHistory.update({
                    email: result.email ,
                    firstName: result.first_name,
                    lastName: result.last_name,
                    mobile: 'null',
                    question: 'no',
                  }).then(() =>{
                    const avg = firebase.database().ref(`/users/${currentUser.uid}/totalTrip`);
                    avg.update({
                      countTrip: 0,
                      avgTotalSpeed: 0,
                      totalDistance: 0,
                      totalDuration: 0,
                      totalCountSpeedLimit: 0,
                      countAlert: 0,
                      countBreak: 0,
                    }).then(() =>{
                       this.goMenu.bind(this);
                    })
                  })
                }else{
                  this.goMenu.bind(this);
                }
          });
        }
      }
      const infoRequest = new GraphRequest('/me', {
        accessToken: accessToken,
        parameters: {
          fields: {
            string: 'email,name,first_name,middle_name,last_name,picture,gender,id'
          }
        }
      }, responseInfoCallback);
      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequest).start()

      const infoRequestLogout = new GraphRequest('/me/permissions', {
        accessToken: accessToken,
        httpMethod: 'DELETE'
      },null, responseInfoCallback);
      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequestLogout).start();
    }

  render() {
    return (
     <View style={styles.container}>
         <View >
           <Image
             source={require('../../images/logo.png') }
             style={styles.imageIcon}
           />
         </View>
         <Text style = {{paddingTop: 20 }}>Sign up with your social account</Text>
         <TouchableOpacity activeOpacity={0.7} style={styles.button_facebook} onPress={ () => this.onLoginFacebook()}>
           <Image
             source={require('../../images/facebook.png') }
             style={{ width: 25, height: 25, marginLeft: 15,}}
           />
           <Text style = {{color: '#ffffff', fontSize: 14}}> SIGN IN WITH FACEBOOK </Text>
         </TouchableOpacity>
         <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
           <Image
             source={require('../../images/substract.png') }
             style={{height: 3, width: 100}}
           />
           <Text style = {{color: '#000000', fontSize: 18}}> OR </Text>
           <Image
             source={require('../../images/substract.png') }
             style={{height: 3, width: 100}}
           />
         </View>
         <View style={styles.textbox_section}>
           <Image
             source={require('../../images/mail.png') }
             style={{ width: 27, height: 27, position: 'absolute', marginLeft: 15}}
           />
          <TextInput
            placeholder='Email'
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            style={styles.textbox}
            underlineColorAndroid="transparent"
            keyboardType={'email-address'}
          />
        </View>
        <View style={styles.textbox_section}>
          <Image
            source={require('../../images/key.png') }
            style={{ width: 25, height: 25, position: 'absolute', marginLeft: 15,}}
          />
         <TextInput
           secureTextEntry = {true}
           placeholder='Password'
           value={this.state.password}
           onChangeText={password => this.setState({ password })}
           style={styles.textbox}
           underlineColorAndroid="transparent"
         />
       </View>
       <TouchableOpacity activeOpacity={0.7} style={styles.button_login} onPress={ () => this.onLogin()}>
        <View>
         <Text style = {{color: '#ffffff', fontSize: 16}}> Login </Text>
        </View>
       </TouchableOpacity>
      <View style = {{flexDirection: 'row', marginTop: 20 }}>
       <Text style = {{fontSize: 16, fontFamily: 'SukhumvitSet-Text',}}> Do not have ac account yet?</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={ () => Actions.register()}>
       <View>
        <Text style = {{fontWeight: 'bold', fontSize: 16, fontFamily: 'SukhumvitSet-Text',}}> Sing up</Text>
       </View>
      </TouchableOpacity>
     </View>
    </View>

   );
  }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   flexDirection: 'column',
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#ffffff',
 },

 buttonContainer: {
  margin: 20,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ffd13b',
  borderRadius: 30,
  width: '70%',
  height: 50,
  marginTop: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 1,
 },
 button_login: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#279591', //#B7BBBB//#DADFDF//#A0C8CB//#83CCD0//#279591
  borderRadius: 10,
  width: '70%',
  height: 50,
  marginTop: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 1,
 },
 button_facebook: {
   margin: 10,
   flexDirection: 'row',
   // justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#4A66D7',
   borderRadius: 30,
   width: '70%',
   height: 50,
   marginTop: 10,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 5 },
   shadowOpacity: 0.8,
   shadowRadius: 2,
   elevation: 1,
 },
imageIcon: {
  width: 120,
  height: 120,
  alignItems: 'center',
},
textbox_section: {
   flexDirection: 'row',
   alignItems: 'center',
   marginTop: 10,
 },
 textbox: {
   fontFamily: 'SukhumvitSet-Text',
   backgroundColor: 'rgba(255,255,255,0.2)',
   borderRadius: 10,
   fontSize: 18,
   color: '#444444',
   width: '70%',
   height: 50,
   paddingLeft: 20,
   // marginTop: 20,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 5 },
   shadowOpacity: 0.8,
   shadowRadius: 2,
   elevation: 1,
   paddingLeft: 50,
 },
});

export default Login;
