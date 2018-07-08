import React, {Component} from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class RunInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
  }

  formatValue(){
    return this.state.value;
  }
  render() {
    let value = this.state.value;
    return(
      <View style = {[styles.runInfoWrapper, {flex: 1}]} >
        <Text style = {styles.runInfoTitle}>{this.props.title}</Text>
        <Text style = {styles.runInfoValue}>{value}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  runInfoWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingVertical: 15
  },
  runInfoTitle: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#666'
  },
  runInfoValue: {
    textAlign:  'center',
    fontWeight: '200',
    fontSize: 24,
    paddingVertical: 5,
  }
})
