import React, {Component} from 'react';
import geolib from 'geolib';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Container, Header, Content, Button} from 'native-base';
import MapView, { ProviderPropType, Marker, AnimatedRegion } from 'react-native-maps';
import prompt from 'react-native-prompt-android';
import { Actions } from 'react-native-router-flux';
import haversine from 'haversine';
import RunInfo from './run-info';
import RunInfoNumeric from './run-numeric';
import firebase from 'firebase';
import Sound from 'react-native-sound';
import { Accelerometer } from "react-native-sensors";
import RNFetchBlob from 'react-native-fetch-blob';
const { width, height } = Dimensions.get('window');
let id = 0;

export default class TestDrive extends Component {
  constructor(props) {
      super(props);

      let watchID = navigator.geolocation.watchPosition((position) => {
        let distance = 0;
        if(this.state.previousCoordinate){
          distance = this.state.distance + haversine(this.state.previousCoordinate,
                                                      position.coords, {unit: 'meter'});
          this.distanceInfo.setState({ value: Number((distance/1000).toFixed(2))})
        }
        this.speedInfo.setState({value: Number((position.coords.speed*3.6).toFixed(2))});
        console.log(Number.parseInt(position.coords.speed, 10)+' > '+Number.parseInt(this.props.maxSpeed, 10));
        if(Number.parseInt(position.coords.speed, 10) >= Number.parseInt(this.props.maxSpeed, 10)){
          this.setState({alert: alert + 1});
          this.playSound();
        }
      this.setState({
          markers: [
            ...this.state.markers, {
              coordinate: position.coords,
              key: id++
            }
          ],
          previousCoordinate: position.coords,
          distance,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: Number((position.coords.speed*3.6).toFixed(2)),
          heading: position.coords.heading,
          timestamp: position.timestamp,
          altitude: position.coords.altitude,
          dis: Number((distance/1000).toFixed(2)),
        });
      }, (error) => alert(JSON.stringify(error)), {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000, distanceFilter:15});

      new Accelerometer({
        updateInterval: 400 // defaults to 100ms
      }).then(observable => {
          observable.subscribe(({x,y,z}) => this.setState({x,y,z}));
      }).catch(error => {
          console.log("The sensor is not available");
      });

      this.state = {
        markers: [],
        watchID,
        hackHeight: height,
        statusButton: false,
        maxSpeed: null,
        car: null,
        dis: 0,
        alert: 0,
        modalVisible: false,
        result: {
          carType: '-' ,
          // time: value2,
          avgSpeed: 0,
          distance: 0,
          duration: 0,
          countSpeedLimits: 0,
          maxSpeed: 0,
          alert: 0,
        },
        x: 0,
        y: 0,
        z: 0,
      };
      this.imagemap = '';
    }

    takeSnapshot() {/*
      console.log('snapshot');
      // 'takeSnapshot' takes a config object with the
      // following options
      const snapshot = this.map.takeSnapshot({
        width: 300,      // optional, when omitted the view-width is used
        height: 300,     // optional, when omitted the view-height is used
        format: 'jpg',   // image formats: 'png', 'jpg' (default: 'png')
        quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
        result: 'file'   // result types: 'file', 'base64' (default: 'file')
      });
      snapshot.then((uri) => {
        this.setState({ mapSnapshot: uri });
        console.log(uri);
      }).catch((e) => {
        console.log(e.error);
      })
    */}

    timeStart(){
      this.playSound();
      var secondsElapsed = 0;
      var seconds = 0;
      var minute = 0;
      var time;
      this.setState({timeStart: 0, alert: 0});
      this._intervalTime = setInterval(() => {
        secondsElapsed = secondsElapsed + 1;
        seconds = ('0' + secondsElapsed % 60).slice(-2);
        minute = Math.floor(secondsElapsed/60);
        time = minute + ':' + seconds;
        this.timeInfo.setState({value: time});
        this.setState({timeStart: minute==0? seconds/60 : minute+seconds/60 })
      }, 1000);

    }

    timeStop(){
      navigator.geolocation.clearWatch(this.watchID);
      clearInterval(this._intervalTime);
    }

    avgData(){
      console.log('avg');
      const { car, maxSpeed, dis, timeStart, alert } = this.state;
      let avgSpeed = dis/(timeStart/60);
      let countTrip

      const { currentUser } = firebase.auth();
      const trip = firebase.database().ref(`/users/${currentUser.uid}/trip`);
      trip.on('value', (snapshot) => {
            let data = snapshot.val();
            let items = Object.values(data);
            let countTrip = items.length;
            let avgTotalSpeed = 0;
            let totalDistance = 0;
            let totalDuration = 0;
            let alert = 0;
            for (var i = 0; i < items.length; i++) {
              avgTotalSpeed = avgTotalSpeed + items[i].avgSpeed;
              totalDistance = totalDistance + items[i].distance;
              totalDuration = totalDuration + items[i].duration;
              alert = alert + items[i].alert;
            }

            avgTotalSpeed = Number((avgTotalSpeed/items.length).toFixed(2));
            totalDistance = Number((totalDistance).toFixed(2));
            totalDuration = Number((totalDuration).toFixed(2));

            const avg = firebase.database().ref(`/users/${currentUser.uid}/totalTrip`);
            avg.update({
              countTrip: countTrip,
              avgTotalSpeed: avgTotalSpeed,
              totalDistance: totalDistance,
              totalDuration: totalDuration,
              totalCountSpeedLimit: 0,
              countAlert: alert,
            });

         });

      {
        /*
        console.log(snapshot);
        snapshot.forEach((child) => {
          console.log(child.key);
          const update = firebase.database().ref(`/users/${currentUser.uid}/totalTrip/${child.key}`);
          console.log('i');
          update.set({
            countTrip: child.val().countTrip + 1,
            avgTotalSpeed: (child.val().avgTotalSpeed + avgSpeed)/2,
            totalDistance: child.val().totalDistance + dis,
            totalDuration: child.val().totalDuration + Number((timeStart/60).toFixed(2)),
            totalCountSpeedLimit: 0,
          }).then(() => {});
        });
        */
      };
    }

    playSound(){
      console.log('sound');
      const mySound = new Sound('http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg', Sound.MAIN_BUNDLE, (e) => {
      if (e) {
        console.log('error', e);
      } else {
        console.log('duration', mySound.getDuration());
        mySound.play();
        mySound.setSpeed(2);
      }
      console.log(mySound);
    });
    mySound.play();
    console.log(mySound);

    {/*  var whoosh = new Sound('Alarm_Clock.mp3', Sound.MAIN_BUNDLE, (error) => {
       if (error) {
         console.log('failed to load the sound', error);
         return;
       }
       // loaded successfully
       console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
      });
      console.log(whoosh);
      // Play the sound with an onEnd callback
      whoosh.play((success) => {
       if (success) {
         console.log('successfully finished playing');
       } else {
         console.log('playback failed due to audio decoding errors');
         // reset the player to its uninitialized state (android only)
         // this is the only option to recover after an error occured and use the player again
         whoosh.reset();
       }
     });  */}
     }

    componentDidMount() {
      console.log(this.props.maxSpeed + ' '+ this.props.car);
      this.setState({maxSpeed: this.props.maxSpeed, car: this.props.car});
        setTimeout( () => this.setState({ hackHeight: height+1}), 500);
        setTimeout( () => this.setState({ hackHeight: height}), 1000);

        this.watchIdFirst = navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            this.setState({
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.02, //วงกว้างจากละติจูด
                longitudeDelta: 0.02,//วงกล้างจากลองจิจูด
              },
              error: null,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {console.log(error);},
          { enableHighAccuracy: false, timeout: 20000},
        );
    }

    componentWillUnmount(){
      navigator.geolocation.clearWatch(this.watchID);
      navigator.geolocation.clearWatch(this.watchIdFirst);
      clearInterval(this._interval);
    }

    addMarker(region){
      let now = (new Data).getTime();
      if(this.state.ladAddedMarker > now - 5000){
        return;
      }

      this.setState({
        markers: [
          ...this.state.marker, {
            coordinate: region,
            key: id++
          }
        ],
        ladAddedMarker: now
      });
    }

    saveData(){
      const { car, maxSpeed, dis, timeStart, alert } = this.state;

      const snapshot = this.map.takeSnapshot({
        width: 300,      // optional, when omitted the view-width is used
        height: 300,     // optional, when omitted the view-height is used
        format: 'jpg',   // image formats: 'png', 'jpg' (default: 'png')
        quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
        result: 'file'   // result types: 'file', 'base64' (default: 'file')
      });
      snapshot.then((uri) => {
        // RNFetchBlob.config({
        //         fileCache: true,
        //       }).fetch('GET', uri).then((res) => {
        //           image = 'file://'+res.data;
        //           console.log(image);
        //       }).catch((err) => {
        //           console.log(err);
        //       })
        this.imagemap = uri;
        console.log(uri);
      }).catch((e) => {
        console.log(e.error);
      })
      let avgSpeed = dis/(timeStart/60);
      const { currentUser } = firebase.auth();
      console.log(this.imagemap);
      // const imageTemp = firebase.storage().ref(`/user/${currentUser.uid}/maps`);
      //
      // imageTemp.putFile(image)
      //   .on('state_changed', snapshot => {
      //       //Current upload state
      //       console.log('state_changed: ', snapshot);
      //   }, err => {
      //       //Error unsubscribe();
      //       console.log('err: ', err);
      //   }, uploadedFile => {
      //       //Success unsubscribe();
      //       console.log('uploadedFile: ', uploadedFile);
      //   });
      // firebase.storage()
      // .ref(`/user/${currentUser.uid}/maps`)
      // .putFile('//data/user/0/com.roadsafety/cache/AirMapSnapshot903161396.jpg',{contentType: 'image/jpeg'})
      // .then(uploadedFile => {
      //     console.log(uploadedFile);
      // })
      // .catch(error => {
      //     console.log(error);
      // });
      const data = firebase.database().ref(`/users/${currentUser.uid}/trip`);
      this.setState({
        result: {
          carType: car ,
          // time: value2,
          avgSpeed: avgSpeed,
          distance: dis,
          duration: Number((timeStart/60).toFixed(2)),
          countSpeedLimits: 0,
          maxSpeed: maxSpeed,
          alert: alert,
        }
      })
      data.push().set({
        carType: car ,
        // time: value2,
        avgSpeed: avgSpeed,
        distance: dis,
        duration: Number((timeStart/60).toFixed(2)),
        countSpeedLimits: 0,
        maxSpeed: maxSpeed,
        alert: alert,
      }).then(() => {
        console.log('alert');
        Alert.alert(
          'Save data success',
          '',
          [
            {text: 'OK', onPress: () => {
              this.showData(car, avgSpeed, dis, timeStart, maxSpeed, alert);
            }},
          ],
        )
      });
    }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  showData(car, avgSpeed, dis, timeStart, maxSpeed, alert){
    {/*let countTrip
    let avgTotalSpeed
    let totalDistance
    let totalDuration
    const { currentUser } = firebase.auth();
    const avg = firebase.database().ref(`/users/${currentUser.uid}/totalTrip`);
    avg.on('value', snapshot => {
      snapshot.forEach((child) => {
        console.log(child.key);
        const update = firebase.database().ref(`/users/${currentUser.uid}/totalTrip/${child.key}`);
        update.set({
          countTrip: child.val().countTrip + 1,
          avgTotalSpeed: (child.val().avgTotalSpeed + avgSpeed)/2,
          totalDistance: child.val().totalDistance + dis,
          totalDuration: child.val().totalDuration + Number((timeStart/60).toFixed(2)),
          totalCountSpeedLimit: 0,
        }).then(() => {});
      });
    });*/}

    console.log(car+' '+avgSpeed+' '+dis+' '+timeStart+' '+maxSpeed);
    this.setModalVisible(true);
  }

  render() {
    return (
      <View style={[styles.container, {paddingBottom: this.state.hackHeight - 80}]}>
      {
        this.state.mapSnapshot?
        <Image
          source={{uri: 'file:///data/data/com.roadsafety/cache/AirMapSnapshot929499133.png'}}
          style={{width: '100%', height: '70%'}}
        />
        :
        <View/>
      }
          <MapView
            style={styles.map}
            showsUserLocation = {true}
            initialRegion={this.state.region}
            ref={map => { this.map = map }}
          >
            <MapView.Polyline
              coordinates={this.state.markers.map((marker) => marker.coordinate)}
              strokeWidth={5}
            />
          </MapView>
          <View style = {styles.infoWrapper}>

          {
            this.state.statusButton === true ?
            <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
            <Button style = {styles.buttonTime}>
              <Text>Start</Text>
            </Button>
            <Button
              style = {styles.buttonTime_at}
              onPress = {() =>{
                this.takeSnapshot();
                this.saveData();
                this.timeStop();
                this.avgData();
                this.setState({statusButton: false});
              }}
            >
              <Text>Stop</Text>
            </Button>
            <Button style = {styles.buttonTime}>
              <Text>Cancel</Text>
            </Button>
            </View>
            :
            <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
            <Button
              style = {styles.buttonTime_at}
              onPress = {() => {
                this.setState({statusButton: true});
                this.timeStart();
              }}
            >
              <Text>Start</Text>
            </Button>
            <Button style = {styles.buttonTime}>
              <Text>Stop</Text>
            </Button>
            <Button onPress = {() => Actions.pop({refresh: {refresh:Math.random()}})} style = {styles.buttonTime_at}>
              <Text>Cancel</Text>
            </Button>
            </View>
          }
          <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <View style = {{flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.75)'}}>
            <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
              <Text>latitude</Text>
            </View>
            <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
              <Text>{this.state.latitude}</Text>
            </View>
          </View>

          <View style = {{flexDirection: 'row', alignItems: 'center',backgroundColor: 'rgba(255, 255, 255, 0.75)'}}>
            <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
              <Text>longitude</Text>
            </View>
            <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
              <Text>{this.state.longitude}</Text>
            </View>
          </View>
          </View>

          <View style = {{flexDirection: 'row'}}>
            <RunInfo
              title = 'Distance ( km )'
              value='0'
              ref={(info) => this.distanceInfo = info}
              />
            <RunInfo
              title = 'Speed ( km/h )'
              value='0'
              ref={(info) => this.speedInfo = info}
            />
            <RunInfo
              title = 'time ( minute )'
              value='0 '
              ref={(info) => this.timeInfo = info}
            />
          </View>
          </View>
          <Modal
          transparent={true}
          animationType="fade"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 130, width: '80%', height: '70%', backgroundColor:'#fff', alignSelf: 'center', borderRadius: 20}}>
            <View>

            <View style = {{marginHorizontal: 10, padding: 10, borderRadius: 10}}>

            <View style = {{height: 30, alignSelf: 'center', marginTop: 5}}>
              <Text>ผลลัพธ์</Text>
            </View>

            {
              this.state.mapSnapshot?
              <Image
                source={{uri: this.state.mapSnapshot.uri}}
                style={{width: '100%', height: '70%'}}
              />
              :
              <View/>
            }


              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>ประเภทรถ</Text>
                </View>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>{this.state.result.carType}</Text>
                </View>
              </View>

              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>ความเร็วเฉลี่ย</Text>
                </View>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>{this.state.result.avgSpeed} km/hr.</Text>
                </View>
              </View>

              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>ระยะทาง</Text>
                </View>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>{this.state.result.distance} km.</Text>
                </View>
              </View>

              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>เวลา</Text>
                </View>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>{this.state.result.duration} hr.</Text>
                </View>
              </View>

              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>ความเร็วที่กำหนด</Text>
                </View>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>{this.state.result.maxSpeed} km/hr.</Text>
                </View>
              </View>

              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>จำนวนการเตือน</Text>
                </View>
                <View style = {{height: 30, alignSelf: 'center', margin: 5}}>
                  <Text>{this.state.result.alert} ครั้ง</Text>
                </View>
              </View>

            </View>

              <TouchableOpacity
                style = {{ borderRadius: 10, backgroundColor: '#88E5F6', width: '60%', alignSelf: 'center', height: 45, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  Actions.pop({refresh: {refresh:Math.random()}});
                }}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      // ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
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
      margin: 10,
      width: 100,
      borderRadius: 10,
      justifyContent: 'center',
      backgroundColor: '#CECECD'
    },
    buttonTime_at:{
      margin: 10,
      width: 100,
      borderRadius: 10,
      justifyContent: 'center',
      backgroundColor: '#FED922'
    }

  });
