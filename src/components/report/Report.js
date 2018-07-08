import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Body,
  Title
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

class Report extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dataTrip: [],
    }
  }

  componentWillMount() {
    const { currentUser } = firebase.auth();
    const greenhouse = firebase.database().ref(`/users/${currentUser.uid}/trip`);
    greenhouse.on('value', snapshot => {
      var items = [];
      snapshot.forEach((child) => {
        items.push({
          key: child.key,
          carType: child.val().carType ,
          avgSpeed: child.val().avgSpeed,
          distance: child.val().distance,
          duration: child.val().duration,
          countSpeedLimits: child.val().countSpeedLimits,
          maxSpeed: child.val().maxSpeed,
        });
      });
      this.setState({dataTrip: items});
      console.log(this.state.dataTrip);
    });
  }

  render() {
    var items = this.state.dataTrip;
    return (
      <Container>
        <Header style={styles.header}>
          <StatusBar backgroundColor="#03BE9C" barStyle="light-content"/>
            <Body style={styles.navigationTitle}>
              <Title style={styles.title}>Report</Title>
            </Body>
        </Header>
        <Content>
          <List dataArray={items}
            renderRow={(item) =>
              <ListItem>
                <TouchableOpacity onPress = {() => {Actions.reportDetail({keyId: item.key})}}>
                  <View style = {{flexDirection: 'row'}}>
                    <View style = {{borderColor: 'red', borderWidth: 1, width: 80, height: 80, marginHorizontal: 10}}>
                    </View>
                    <View style = {{justifyContent: 'center'}}>
                      <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                        <View style = {{height: 30, alignSelf: 'center'}}>
                          <Text>ประเภทรถ   </Text>
                        </View>
                        <View style = {{height: 30, alignSelf: 'center'}}>
                          <Text>{item.carType}</Text>
                        </View>
                      </View>

                      <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                        <View style = {{height: 30, alignSelf: 'center'}}>
                          <Text>ความเร็วเฉลี่ย   </Text>
                        </View>
                        <View style = {{height: 30, alignSelf: 'center'}}>
                          <Text>{item.avgSpeed} km/hr.</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </ListItem>
            }>
          </List>
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
});

export default Report;
