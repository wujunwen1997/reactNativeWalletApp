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
  Platform
} from 'react-native';
import {Toast, Provider, Button, Icon, Modal} from '@ant-design/react-native';
import { connect } from 'react-redux';
import Ficon from '../../../assets/Icomoon';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

class passwordEnter extends Component{
  static navigationOptions = ({navigation}) => {
    return {
      header: null
    };
  };
  state = {
    code: '',
  };
  pinInput = React.createRef();
  componentDidMount() {
    const {dispatch} = this.props;
    if (Platform.OS === 'ios') {

    } else {
      dispatch({type: 'home/getPERMISSIONS', payload: ''})
    }
  }
  _checkCode = (code) => {
    const {dispatch, model, navigation} = this.props;
    const {home} = model;
    this.setState({ code: '' });
    home.Wallet.openIdentity({password: code}).then(res => {
      if (res.success) {
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
        Toast.fail('密码错误，请重新输入', 1);
      }
    })
  }
  render() {
    const { code } = this.state;
    const {dispatch, model} = this.props;
    const {home} = model;
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
        <View style={styles.container}>
          <StatusBar barStyle={'dark-content'} animated={false} backgroundColor={'#fff'}/>
          <View style={styles.header}>
            <Text style={styles.tips}>身份验证</Text>
          </View>
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

            <Text style={styles.tipText}>请输入解锁密码</Text>
            <SmoothPinCodeInput ref={this.pinInput} value={code} password={true} cellSpacing={0.5} restrictToNumbers={true}
                                textStyleFocused={null} mask={'*'} maskDelay={100} autoFocus={true}
                                cellStyle={{
                borderWidth: 0.8,
                borderColor: '#EFEFEF',
                backgroundColor: 'white',
              }} cellStyleFocused={null}
              codeLength={6}
              onTextChange={code => this.setState({ code })}
              onFulfill={this._checkCode}
            />
          </View>
        </View>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor:'#F6F6F6', alignItems: 'center' },
  header: { backgroundColor: '#fff', paddingTop: 24, width: '100%'},
  input: {marginTop :24, padding: 12, alignItems: 'center'},
  tipText: {marginBottom: 20, fontSize: 16, color: '#333', textAlign: 'center'},
  tips: {height: 50, textAlign: 'center', lineHeight: 50, fontSize: 18, color: '#333'},
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
  tip: {marginTop: 10, fontWeight: 'bold'}
});
export default connect(model => ({ model }))(passwordEnter)
