import React, {Component} from 'react'
import {
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  Text,
  PermissionsAndroid,
  Keyboard,
  Image,
  AsyncStorage,
  Platform, KeyboardAvoidingView
} from 'react-native';
import {Toast, WingBlank, Provider, Button, Icon, Modal} from '@ant-design/react-native';
import { connect } from 'react-redux';
import Ficon from '../../../assets/Icomoon';
import BackImage from "../../../components/headerView/backImage";
import {activeBtnDark, btnDark, createUser} from "../../../styles/common";

class passwordEnter extends Component{
  static navigationOptions = ({navigation}) => {
    return {
      header: null
    };
  };
  componentDidMount() {
    const {dispatch} = this.props;
    if (Platform.OS === 'ios') {

    } else {
      dispatch({type: 'home/getPERMISSIONS', payload: ''})
    }
    //
  }
  render() {
    const {dispatch, model, navigation} = this.props;
    const {home} = model;
    const changePassword = (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {enterPassword: val }
      })
    };
    const onEnter = () => {
      Keyboard.dismiss();
      home.Wallet.openIdentity({password: home.enterPassword}).then(res => {
        if (res.success) {
          dispatch({
            type: 'home/updateState',
            payload: {
              enterPassword: '',
            }
          });
          if (home.haveMnemonic) {
            dispatch({
              type: 'home/updateState',
              payload: {
                mnemonics: res.mnemonic.split(" "),
                mnemonic:res.mnemonic,
                copyM: []
              }
            });
            navigation.navigate('BackupPrompt');
            return;
          }
          AsyncStorage.getItem('haveMnemonic').then(u => {
            if (u === 'yes') {
              dispatch({
                type: 'home/updateState',
                payload: {
                  walletNickName: res.nick,
                  identity: res.identity,
                }
              });
              navigation.navigate('Home');
            } else {
              dispatch({
                type: 'home/updateState',
                payload: {
                  mnemonics: res.mnemonic.split(" "),
                  mnemonic:res.mnemonic,
                  copyM: []
                }
              });
              navigation.navigate('BackupPrompt')
            }
          })
        } else {
          Toast.fail('密码错误，请重新输入', 1)
        }
      })
    };
    async function requestMultiplePermission() {
      const permissions = [];
      home.PERMISSIONS[0].load !== 'duihao' && permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
      home.PERMISSIONS[1].load !== 'duihao' && permissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      home.PERMISSIONS[2].load !== 'duihao' && permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      try {
        const arr = Object.values(await PermissionsAndroid.requestMultiple(permissions));
        if (arr.length > 0) {
          arr.includes('denied') && Toast.info('请允许所有授权', 2);
          arr.includes('never_ask_again') && Toast.info('您选择了never_ask_again, 请在-设置-中设置相机和读写文件权限', 3);
          dispatch({type: 'home/getPERMISSIONS', payload: ''})
        }
      } catch (err) {
        Toast.fail('授权发生错误，请重启', 2)
      }
    }

    return (
      <Provider>
        <WingBlank style={styles.container}>
          <StatusBar barStyle={'dark-content'} animated={true}/>
          <View style={styles.input}>
            {
              home.visible && <Modal transparent visible={true} style={styles.Model} animationType="slide-up">
                <View style={styles.top}>
                  <Image source={require('../../../assets/images/r3.png')} style={styles.head}/>
                  <Text style={styles.tip}>开启授权</Text>
                </View>
                {
                  home.PERMISSIONS.map(u => {
                    return(
                      <View key={u.icon} style={styles.div}>
                        <View style={styles.left}>
                          <Icon name={u.icon}/><Text style={styles.til}>{u.til}</Text>
                        </View>
                        {u.load !== '' && <Ficon name={u.load} size={16} style={styles.isCheck}/>}
                      </View>
                    )})
                }
                <View>
                  <Button style={styles.btn} type={'ghost'} onPress={requestMultiplePermission}>一键授权</Button>
                </View>
              </Modal>
            }
            <Text style={{fontSize: 22,color: '#333', marginTop: 40}}>欢迎进入链付钱包</Text>
            <Text style={{marginTop: 60, fontSize: 16, color: '#333'}}>请输入解锁密码</Text>
            <TextInput placeholder='请输入密码' textContentType='password' style={styles.inputDiv} value={home.enterPassword}
                       onChangeText={changePassword} selectionColor={'#9d9d9d'} secureTextEntry={true}/>
          </View>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20}>
            <WingBlank style={styles.btnBot}>
              <Button style={btnDark} type="primary"
                      activeStyle={activeBtnDark} onPress={onEnter}>
                <Text style={createUser}>完成</Text>
              </Button>
            </WingBlank>
          </KeyboardAvoidingView>
        </WingBlank>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor:'#ffffff', justifyContent:'space-between'},
  input: {marginTop :24,height: 300, padding: 12},
  inputDiv: {width: '100%', borderBottomWidth: 0.8, borderColor: '#EFEFEF', marginTop: 30 },
  text: { color: '#358BFE', height: 40,lineHeight:40,width: '100%', textAlign: 'center',},
  Model: { padding: 0, justifyContent: 'center'},
  div: {flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center',borderBottomWidth: 0.8, borderColor: '#efefef',},
  left: {flexDirection: 'row',},
  til: {marginLeft: 10},
  btn: {borderWidth: 0,  marginTop: 10,borderTopColor: '#efefef', height: 40,},
  isCheck: {color: '#b8b8b8'},
  top: {height: 100,display: 'flex', alignItems: 'center', borderBottomWidth: 0.8, borderColor: '#efefef',},
  head: {height: 60, width: 60,  },
  btnBot: {marginBottom: 64},
  tip: {marginTop: 10, fontWeight: 'bold'}
});
export default connect(model => ({ model }))(passwordEnter)
