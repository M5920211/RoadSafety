import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  ToolbarAndroid,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Title
} from 'native-base';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import MultiSelect from 'react-native-multiple-select';
import firebase from 'firebase';

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.dataQuestion = null;
    this.state = {
      statusQuestionCheck: true,
      dataQt: null,
      statusQuestion: false,
      radio_one: [
        {label: 'ไม่มีทั้งสอง', value: '1' },
        {label: 'มี รถจักรยานยนต์', value: '2' },
        {label: 'มี รถยนต์', value: '3์' },
        {label: 'มีทั้งสอง', value: '4' }
      ],
      radio_two: [
        {label: 'ไม่มีเลย', value: '1' },
        {label: 'มีประกันอุบัติเหตุส่วนบุลคล', value: '2' },
        {label: 'มีประกันอุบัติเหตุกลุ่ม', value: '3' },
        {label: 'มีประกันอุบัติเหตุนิสิตและนักศึกษา', value: '4' }
      ],
      radio_three: [
        {label: 'เคย', value: '1' },
        {label: 'ไม่เคย', value: '2' },
      ],
      selectedItems1: [],
      items1: [{
        id: 'เมาสุรา',
        name: 'เมาสุรา',
      }, {
        id: 'เสพสาร ออกฤทธิ์ ต่อจิตและ ประสาท',
        name: 'เสพสาร ออกฤทธิ์ ต่อจิตและ ประสาท',
      }, {
        id: 'ใช้โทรศัพท์มือถือ',
        name: 'ใช้โทรศัพท์มือถือ',
      }, {
        id: 'ไม่คาดเข็มขัดนิรภัย',
        name: 'ไม่คาดเข็มขัดนิรภัย',
      }, {
        id: 'ไม่สวมหมวกกันน๊อค',
        name: 'ไม่สวมหมวกกันน๊อค',
      }, {
        id: 'ไม่ให้สัญาณจอดรถ/เลี้ยว/ชะลอ',
        name: 'ไม่ให้สัญาณจอดรถ/เลี้ยว/ชะลอ',
      }, {
        id: 'ไม่หยุดรถในช่องทางข้าม',
        name: 'ไม่หยุดรถในช่องทางข้าม',
      }, {
        id: 'ไม่ให้โคมไฟในเวลาค่ำคืน',
        name: 'ไม่ให้โคมไฟในเวลาค่ำคืน',
      }, {
        id: 'ไม่ยอมรถที่มีสิทธิไปก่อน',
        name: 'ไม่ยอมรถที่มีสิทธิไปก่อน',
      }, {
        id: 'ไม่ปิดประตูรถผู้โดยสาร',
        name: 'ไม่ปิดประตูรถผู้โดยสาร',
      }, {
        id: 'ไม่ปิดล๊อคกระบะท้าย',
        name: 'ไม่ปิดล๊อคกระบะท้าย',
      }, {
        id: 'ขับรถนอกช่องประจำทาง',
        name: 'ขับรถนอกช่องประจำทาง',
      }, {
        id: 'ขับรถหลับใน',
        name: 'ขับรถหลับใน',
      }, {
        id: 'ขับรถเร็วเกินกว่ากฎหมายกำหนด',
        name: 'ขับรถเร็วเกินกว่ากฎหมายกำหนด',
      }, {
        id: 'ขับรถตัดหน้ากระชั้นชิด',
        name: 'ขับรถตัดหน้ากระชั้นชิด',
      }, {
        id: 'ขับรถตามกระชั้นชิด',
        name: 'ขับรถตามกระชั้นชิด',
      }, {
        id: 'ขับรถผิดช่องทาง',
        name: 'ขับรถผิดช่องทาง',
      }, {
        id: 'ขับรถฝ่าฝืนเครื่องหมาย/สัญญาณ',
        name: 'ขับรถฝ่าฝืนเครื่องหมาย/สัญญาณ',
      }, {
        id: 'ขับรถคร่อมเส้นแบ่งทาง',
        name: 'ขับรถคร่อมเส้นแบ่งทาง',
      }, {
        id: 'ขับรถแซงอย่างผิดกฎหมาย',
        name: 'ขับรถแซงอย่างผิดกฎหมาย',
      }, {
        id: 'ขับรถไม่ชำนาญ',
        name: 'ขับรถไม่ชำนาญ',
      }, {
        id: 'บรรทุกเกินอัตรา',
        name: 'บรรทุกเกินอัตรา',
      }, {
        id: 'เจ็บป่วยกระทันหัน',
        name: 'เจ็บป่วยกระทันหัน',
      }, {
        id: 'หยุดรถโดยสารนอกเขต/ป้าย',
        name: 'หยุดรถโดยสารนอกเขต/ป้าย',
      }, {
        id: 'ชะลอ/หยุดรถกระทันหัน',
        name: 'ชะลอ/หยุดรถกระทันหัน',
      }, {
        id: 'รถเสียไม่แสดงเครื่องหมาย/สัญญาณ',
        name: 'รถเสียไม่แสดงเครื่องหมาย/สัญญาณ',
      }, {
        id: 'ใช้สัญญาณไฟไม่ถูกต้อง',
        name: 'ใช้สัญญาณไฟไม่ถูกต้อง',
      }, {
        id: 'ฝ่าฝืนป้ายหยุดขณะออกจากทางร่วม/แยก',
        name: 'ฝ่าฝืนป้ายหยุดขณะออกจากทางร่วม/แยก',
      }, {
        id: 'ไม่ขับรถในช่องทางซ้ายสุด',
        name: 'ไม่ขับรถในช่องทางซ้ายสุด',
      }],
      selectedItems2: [],
      items2: [{
        id: 'ถนนลื่น',
        name: 'ถนนลื่น',
      }, {
        id: 'ถนนชำรุด',
        name: 'ถนนชำรุด',
      }, {
        id: 'ถนนแคบ',
        name: 'ถนนแคบ',
      }, {
        id: 'ถนนมืด',
        name: 'ถนนมืด',
      }, {
        id: 'มีฝนตก',
        name: 'มีฝนตก',
      }, {
        id: 'มีหมอก/ควันฝุ่นมาก',
        name: 'มีหมอก/ควันฝุ่นมาก',
      }, {
        id: 'มีสิ่งบังตา',
        name: 'มีสิ่งบังตา',
      }, {
        id: 'มีการขุด/เจาะ/ซ่อม/สร้างทาง',
        name: 'มีการขุด/เจาะ/ซ่อม/สร้างทาง',
      }, {
        id: 'มีแสงส่องเข้าตา',
        name: 'มีแสงส่องเข้าตา',
      }, {
        id: 'มีกองวัสดุ/สิ่งของกีดขวาง',
        name: 'มีกองวัสดุ/สิ่งของกีดขวาง',
      }, {
        id: 'ไม่มีป้ายสัญญาณจราจรเตือน',
        name: 'ไม่มีป้ายสัญญาณจราจรเตือน',
      }, {
        id: 'ระบบไฟฟ้าจราจรขัดข้อง/ไม่มี',
        name: 'ระบบไฟฟ้าจราจรขัดข้อง/ไม่มี',
      }, {
        id: 'คนตัดหน้ารถ',
        name: 'คนตัดหน้ารถ',
      }, {
        id: 'สัตว์ตัดหน้ารถ',
        name: 'สัตว์ตัดหน้ารถ',
      }, {
        id: 'อากาศมืดครึ้ม',
        name: 'อากาศมืดครึ้ม',
      }],
      selectedItems3: [],
      items3: [{
        id: 'ระบบห้ามล้อขัดข้อง',
        name: 'ระบบห้ามล้อขัดข้อง',
      }, {
        id: 'ระบบบังคับเลี้ยวขัดข้อง',
        name: 'ระบบบังคับเลี้ยวขัดข้อง',
      }, {
        id: 'ระบบเครื่องยนต์ขัดข้อง',
        name: 'ระบบเครื่องยนต์ขัดข้อง',
      }, {
        id: 'ระบบระบายความร้อนชำรุด',
        name: 'ระบบระบายความร้อนชำรุด',
      }, {
        id: 'ระบบเชื้อเพลิงชำรุด',
        name: 'ระบบเชื้อเพลิงชำรุด',
      }, {
        id: 'อุปกรณ์นิรภัยชำรุด',
        name: 'อุปกรณ์นิรภัยชำรุด',
      }, {
        id: 'ที่ปัดน้ำฝนชำรุด',
        name: 'ที่ปัดน้ำฝนชำรุด',
      }, {
        id: 'ห้ามล้อมือชำรุด',
        name: 'ห้ามล้อมือชำรุด',
      }, {
        id: 'ประตู / ฝากระโปงชำรุด',
        name: 'ประตู / ฝากระโปงชำรุด',
      }, {
        id: 'กระจกส่องหลังชำรุด',
        name: 'กระจกส่องหลังชำรุด',
      }, {
        id: 'กระจกแตก',
        name: 'กระจกแตก',
      }, {
        id: 'ยางแตก',
        name: 'ยางแตก',
      }, {
        id: 'ยางเสื่อมสภาพ',
        name: 'ยางเสื่อมสภาพ',
      }, {
        id: 'ติดฟิล์มผิดกฎหมาย',
        name: 'ติดฟิล์มผิดกฎหมาย',
      }, {
        id: 'ดัดแปลงสภาพผิดกฎหมาย',
        name: 'ดัดแปลงสภาพผิดกฎหมาย',
      }, {
        id: 'ล้อ/เพลาหลุด',
        name: 'ล้อ/เพลาหลุด',
      }],
      value1: null,
      value2: null,
      value3: null,
      value4: null,
    };
  }

  componentDidMount(){
    const { currentUser } = firebase.auth();
    const data = firebase.database().ref(`/users/${currentUser.uid}/history`);
    data.on('value', snapshot => {
      snapshot.forEach((child) => {
        console.log(child.key);
        if(child.val().question == 'yes'){
          const question = firebase.database().ref(`/users/${currentUser.uid}/question`);
          question.on('value', snapshot => {
            var items = null;
            var q1 = '';
            var q2 = '';
            var q3 = '';
            var q4 = '';

            snapshot.forEach((child) => {
              if(child.val().Q1DriverLicense === '1'){
                q1 = 'ไม่มีทั้งสอง';
              }else if (child.val().Q1DriverLicense === '2') {
                q1 = 'มี รถจักรยานยนต์';
              }else if (child.val().Q1DriverLicense === '3') {
                q1 = 'มี รถจักรยานยนต์';
              }else if (child.val().Q1DriverLicense === '4') {
                q1 = 'มีทั้งสอง';
              }

              if(child.val().Q2Carlnsurance === '1'){
                q2 = 'ไม่มีเลย';
              }else if (child.val().Q2Carlnsurance === '2') {
                q2 = 'มีประกันอุบัติเหตุส่วนบุลคล';
              }else if (child.val().Q2Carlnsurance === '3') {
                q2 = 'มีประกันอุบัติเหตุกลุ่ม';
              }else if (child.val().Q2Carlnsurance === '4') {
                q2 = 'มีประกันอุบัติเหตุนิสิตและนักศึกษา';
              }

              if(child.val().Q3Accidents === '1'){
                q3 = 'เคย';
              }else if (child.val().Q3Accidents === '2') {
                q3 = 'ไม่เคย';
              }

              if(child.val().Q4RoadAccidents){
                q4 = child.val().Q4RoadAccidents.split(',');
                console.log(q4)
              }

              items = {
                q1: q1,
                q2: q2,
                q3: q3,
                q4: q4,
              }
            });
            this.setState({dataQt: items})
          });
          this.setState({statusQuestionCheck: false, statusQuestion: true});
        }else{
          this.setState({statusQuestionCheck: false, statusQuestion: false});
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
      if(nextProps.status){
        this.setState({statusQuestion: true});
      }
  }

  renderScene(){
    if(this.state.statusQuestionCheck){
      return(
        <ActivityIndicator size="large" style = {{justifyContent: 'center', alignSelf: 'center', flex: 1}} />
      );
    }else{
      if(this.state.statusQuestion)
      {
        console.log(this.state.dataQt);
        if(this.state.dataQt){
          return(
              <View style = {{padding: 20}}>
                <Text style = {styles.text}>1.  มีใบอนุญาตเป็นผู้ขับรถหรือไม่</Text>
                <Text style = {styles.textDetail}>- {this.state.dataQt.q1}</Text>
                <Text style = {styles.text}>2.  มีประกันอุบัติเหตุหรือไม</Text>
                <Text style = {styles.textDetail}>- {this.state.dataQt.q2}</Text>
                <Text style = {styles.text}>3.  เคยเกิดอุบัติเหตุหรือไม</Text>
                <Text style = {styles.textDetail}>- {this.state.dataQt.q3}</Text>
                {
                  this.state.dataQt.q4 ?
                  <View>
                  <Text style = {styles.text}>4.  สาเหตุการเกิดอุบัติเหตุ 3 อันดับ</Text>
                  {
                    this.renderQuestion4(this.state.dataQt.q4)
                  }
                  </View>
                  :
                  <View/>
                }

              </View>
          );
        }else{
          return(
              <ActivityIndicator size="large" style = {{justifyContent: 'center', alignSelf: 'center', flex: 1}} />
          );
        }

      }
      else
      {
        const { selectedItems1 } = this.state;
        const { selectedItems2 } = this.state;
        const { selectedItems3 } = this.state;
        return(
          <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style = {styles.question_group}>
            <View style = {styles.question_box}>
              <Text style = {styles.text_num}>1.  มีใบอนุญาตเป็นผู้ขับรถหรือไม่</Text>
              <RadioGroup
                onSelect = {(index, value) => this.onSelect1(index, value)}
              >
                <RadioButton value={'1'} >
                  <Text>ไม่มีทั้งสอง</Text>
                </RadioButton>

                <RadioButton value={'2'}>
                  <Text>มี รถจักรยานยนต์</Text>
                </RadioButton>

                <RadioButton value={'3์'}>
                  <Text>มี รถยนต์</Text>
                </RadioButton>

                <RadioButton value={'4'}>
                  <Text>มีทั้งสอง</Text>
                </RadioButton>
              </RadioGroup>
            </View>
            <View style = {styles.question_box}>
              <Text style = {styles.text_num}>2.  มีประกันอุบัติเหตุหรือไม่</Text>
              <RadioGroup
                onSelect = {(index, value) => this.onSelect2(index, value)}
              >
                <RadioButton value={'1'} >
                  <Text>ไม่มีเลย</Text>
                </RadioButton>

                <RadioButton value={'2'}>
                  <Text>มีประกันอุบัติเหตุส่วนบุลคล</Text>
                </RadioButton>

                <RadioButton value={'3'}>
                  <Text>มีประกันอุบัติเหตุกลุ่ม</Text>
                </RadioButton>

                <RadioButton value={'4'}>
                  <Text>มีประกันอุบัติเหตุนิสิตและนักศึกษา</Text>
                </RadioButton>
              </RadioGroup>
            </View>
            <View style = {styles.question_box}>
              <Text style = {styles.text_num}>3.  เคยเกิดอุบัติเหตุหรือไม่</Text>
              <RadioGroup
                onSelect = {(index, value) => this.onSelect3(index, value)}
              >
                <RadioButton value={'1'} >
                  <Text>เคย</Text>
                </RadioButton>

                <RadioButton value={'2'}>
                  <Text>ไม่เคย</Text>
                </RadioButton>
              </RadioGroup>
            </View>
            {
              this.state.value3 == '1' ?
              <View style = {styles.question_box}>
                <Text style = {styles.text_num}>4.  สาเหตุการเกิดอุบัติเหตุ 3 อันดับ</Text>
                <MultiSelect
                  hideTags
                  items={this.state.items1}
                  uniqueKey="id"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onSelectedItemsChange1}
                  selectedItems={selectedItems1}
                  selectText="--สาเหตุจากบุคคล-- "
                  altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor="#CCC"
                  submitButtonText="Submit"
                />
                {/*{this.multiSelect.getSelectedItemsExt(selectedItems1)}*/}
                <MultiSelect
                  hideTags
                  items={this.state.items2}
                  uniqueKey="id"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onSelectedItemsChange2}
                  selectedItems={selectedItems2}
                  selectText="--สาเหตุจากสิ่งแวดล้อม-- "
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={ (text)=> console.log(text)}
                  altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor="#CCC"
                  submitButtonText="Submit"
                />
                {/*this.multiSelect.getSelectedItemsExt(selectedItems2)*/}
                <MultiSelect
                  hideTags
                  items={this.state.items3}
                  uniqueKey="id"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onSelectedItemsChange3}
                  selectedItems={selectedItems3}
                  selectText="--สาเหตุจากอุปกรณ์ที่ใช้ขับขี่-- "
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={ (text)=> console.log(text)}
                  altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor="#CCC"
                  submitButtonText="Submit"
                />
                {/*{this.multiSelect.getSelectedItemsExt(selectedItems3)}*/}
                <View>
                <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress = {() => this.saveSelect1()}>
                 <View>
                  <Text> Save </Text>
                 </View>
                </TouchableOpacity>
                </View>
              </View>
              :
              <View>
              <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress = {() => this.saveSelect2()}>
               <View>
                <Text> Save </Text>
               </View>
              </TouchableOpacity>
              </View>
            }
          </View>
          </ScrollView>
        );
      }
    }
  }

  renderQuestion4(data){

    return data.map(function(q, i){
      if(q !== ' '){
        return(
          <View key={i}>
            <Text style = {styles.textDetail}>- {q}</Text>
          </View>
        );
      }
    });
  }

  onSelect1(index, value){
    this.setState({value1: value});
  }

  onSelect2(index, value){
    this.setState({value2: value});
  }

  onSelect3(index, value){
    this.setState({value3: value});
  }

  onSelectedItemsChange1 = selectedItems1 => {
    this.setState({ selectedItems1 });
  };

  onSelectedItemsChange2 = selectedItems2 => {
    this.setState({ selectedItems2 });
  };

  onSelectedItemsChange3 = selectedItems3 => {
    this.setState({ selectedItems3 });
  };

  saveSelect1(){
    const { value1, value2, value3, selectedItems1, selectedItems2, selectedItems3 } = this.state;
    const { currentUser } = firebase.auth();
    const data = firebase.database().ref(`/users/${currentUser.uid}/question`);
    data.push().set({
      Q1DriverLicense: value1 ,
      Q2Carlnsurance: value2,
      Q3Accidents: value3,
      Q4RoadAccidents: selectedItems1+', '+selectedItems2+', '+selectedItems3,
    }).then(() => {
      const keyHis = firebase.database().ref(`/users/${currentUser.uid}/history`);
      keyHis.update({
        question: 'yes',
      })
    });
  }

  saveSelect2(){
    const { value1, value2, value3 } = this.state;
    const { currentUser } = firebase.auth();
    const data = firebase.database().ref(`/users/${currentUser.uid}/question`);
    data.push().set({
      Q1DriverLicense: value1 ,
      Q2Carlnsurance: value2,
      Q3Accidents: value3,
    }).then(() => {
      const keyHis = firebase.database().ref(`/users/${currentUser.uid}/history`);
      keyHis.on('value', snapshot => {
        snapshot.forEach((child) => {
          const status = firebase.database().ref(`/users/${currentUser.uid}/history/${child.key}`);
          status.set({
            email: child.val().email ,
            firstName: child.val().firstName,
            lastName: child.val().lastName,
            mobile: child.val().mobile,
            question: 'yes',
          })
            .then(() => {
              alert('บันทึกข้อมูลเรียบร้อย');
              Actions.refresh({
                status: 'save'
              })
            });
        });
      });
    });
  }

  render() {
    return (
     <View style={styles.container}>
      <Header style={styles.header}>
        <StatusBar backgroundColor="#03BE9C" barStyle="light-content"/>
          <Body style={styles.navigationTitle}>
            <Title style={styles.title}>Question</Title>
          </Body>
      </Header>
      {this.renderScene()}
     </View>

   );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   flexDirection: 'column',
   width: '100%',
   height: '100%',
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
  question_group: {
    flexDirection: 'column',
    margin: 10,
  },
  question_box: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  text_num: {
    fontSize: 18,
    marginBottom: 10,
  },
  radioButtonStyle: {
    justifyContent: 'flex-start'
  },
  buttonContainer: {
  // margin: 5,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ffd13b',
  borderRadius: 10,
  width: '100%',
  height: 50,
  marginTop: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 1,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  textDetail: {
    fontSize: 16,
    left: 20,
    marginBottom: 20,
  }
});
