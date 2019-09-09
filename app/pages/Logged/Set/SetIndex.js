import React, {Component} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Keyboard, AsyncStorage} from 'react-native';
import {WingBlank, Modal, Provider, Toast, Portal} from '@ant-design/react-native';
import BackImage from "../../../components/headerView/backImage";
import Ficon from '../../../assets/Icomoon';
import { connect } from 'react-redux';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

class SetIndex extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '设置',
      headerLeft: <BackImage event={() => {navigation.navigate('Home')}}/>,
    }
  };
  onCancellation = () => {
    this.setState({ visible: true });
  };
  onButtonClick  = () => {
    this.setState({ visible1: true });
  };
  state = {
    code: '',
    visible: false,
    visible1: false,
    arr: [
      // {route: 'AboutUs', icon: 'feedback', text: '帮助与反馈'},
      {route: 'AboutUs', icon: 'guanyuwomen', text: '关于我们', style: {marginRight: 12, width: 20}},
      {route: 'IdentityName', icon: 'qianbaoming', text: '身份名', size: 18, style: {marginLeft: 0.6, marginRight: 12, width: 20}},
      { icon: 'bianji', text: '备份助记词', event: this.onButtonClick,  size: 15, style: {marginLeft: 2, marginRight: 11, width: 20}},
      { icon: 'zhuxiao', text: '注销钱包', event: this.onCancellation,  size: 18, style: {marginLeft: 1.9, marginRight: 11, width: 20}},
    ]
  };
  pinInput = React.createRef();
  _checkCode1 = (code) => { this._checkCode(code, 'BackupPrompt')};
  _checkCode = (code, route) => {
  const {dispatch, model, navigation} = this.props;
  const {home} = model;
  this.setState({ code: '' });
  home.Wallet.openIdentity({password: code}).then(res => {
    if (res.success) {
      AsyncStorage.setItem('haveMnemonic', 'no');
      const key = Toast.loading(route !== 'BackupPrompt' ? '身份注销中...' : '正在跳转...', 20);
      if (route !== "BackupPrompt") {
        home.Wallet.destroy_identity().then(res => {
          dispatch({
            type: 'home/updateState',
            payload: {enterPassword: '' }
          });
          Portal.remove(key);
          navigation.navigate('AuthLoading')
        })
      } else {
        model.home.Wallet.openIdentity({password: code}).then(res => {
          dispatch({
            type: 'home/updateState',
            payload: {
              enterPassword: '',
              haveMnemonic: true,
              mnemonics: res.mnemonic.split(" "),
              mnemonic:res.mnemonic,
              copyM: []
            },
          });
          navigation.navigate('BackupPrompt')
        })
      }
    } else {
      Keyboard.dismiss();
      this.pinInput.current.shake()
        .then(() => {
          Toast.fail('密码错误，请重新输入', 1, '', false)
        });
    }
  })
  }
  render() {
    const {navigation, dispatch, model} = this.props;
    const { code } = this.state;
    const {Wallet, enterPassword} = model.home;
    const goRoute = (u) => {
      if (u.route) {
        navigation.navigate(u.route)
      } else if (u.event) {
        u.event(u.isCopy)
      }
    };
    return (
      <Provider>
        <Modal
          title="请输入密码"
          transparent
          onClose={() => this.setState({ visible1: false })}
          maskClosable
          visible={this.state.visible1}
          style={{position: 'absolute', top:20}}
        >
          <View style={s.input}>
            <SmoothPinCodeInput ref={this.pinInput} value={code} password={true} cellSpacing={3} restrictToNumbers={true}
                                textStyleFocused={null} mask={'*'} maskDelay={100} autoFocus={true} cellSize={42}
                                cellStyle={{
                                  borderWidth: 0.5,
                                  borderColor: '#d8d8d8',
                                  backgroundColor: 'white',
                                }} cellStyleFocused={null}
                                codeLength={6}
                                onTextChange={code => this.setState({ code })}
                                onFulfill={this._checkCode1}
            />
          </View>
        </Modal>
        <Modal
          title="请输入密码"
          transparent
          onClose={() => this.setState({ visible: false })}
          maskClosable
          visible={this.state.visible}
          style={{position: 'absolute', top:20}}
        >
          <Text style={{}}>警告： 注销钱包是清除此钱包，请确认是否保有助记词，否则会彻底失去此钱包。</Text>
          <View style={s.input}>
            <SmoothPinCodeInput ref={this.pinInput} value={code} password={true} cellSpacing={3} restrictToNumbers={true}
                                textStyleFocused={null} mask={'*'} maskDelay={100} autoFocus={true} cellSize={42}
                                cellStyle={{
                                  borderWidth: 0.5,
                                  borderColor: '#d8d8d8',
                                  backgroundColor: 'white',
                                }} cellStyleFocused={null}
                                codeLength={6}
                                onTextChange={code => this.setState({ code })}
                                onFulfill={this._checkCode}
            />
          </View>
        </Modal>
        <WingBlank style={s.container}>
          <StatusBar translucent={true} barStyle={'dark-content'} animated={true}/>
          {
            this.state.arr.map((u,i) => {
              return(
                <TouchableOpacity onPress={() => goRoute(u)} key={i} activeOpacity={0.8}>
                  <View style={s.viewList}>
                    <View style={s.view}>
                      <Ficon name={u.icon} size={u.size || 18} style={u.style}/>
                      <Text style={s.name}>{u.text}</Text>
                    </View>
                    <Ficon name={'left1'} size={16} style={{color: '#c4c4c4'}}/>
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </WingBlank>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'flex-start',},
  viewList: {height: 64, width: '100%', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', borderBottomWidth: 0.8, borderBottomColor: '#f6f6f6'},
  view: {height: '100%', flexDirection: 'row', alignItems: 'center', color: '#515151'},
  name: {color: '#4f4f4f'},
  input: {height: 40, backgroundColor: '#FFF', fontSize: 15,borderBottomWidth: 0.5,marginTop: 10,borderColor: '#EFEFEF',
    alignItems: 'center', justifyContent: 'center', color: '#666',},
  inputDiv: {width: '100%',paddingLeft: 12, borderWidth: 0.5, height: 40, borderRadius: 5, borderColor: '#d8d8d8'},
});
export default connect(model => ({ model }))(SetIndex)
