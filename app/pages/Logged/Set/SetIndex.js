import React, {Component} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Keyboard} from 'react-native';
import {WingBlank, Modal, Provider, Toast, Portal} from '@ant-design/react-native';
import BackImage from "../../../components/headerView/backImage";
import Ficon from '../../../assets/Icomoon';
import { connect } from 'react-redux';

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
  render() {
    const {navigation, dispatch, model} = this.props;
    const {Wallet, enterPassword} = model.home;
    const goRoute = (u) => {
      if (u.route) {
        navigation.navigate(u.route)
      } else if (u.event) {
        u.event(u.isCopy)
      }
    };
    const footerButtons = [
        { text: '取消', onPress: () => { this.setState({ visible: false });} },
        { text: '确认', onPress: () => {checkPassword('AuthLoading')} },
    ];
    const footerButtons1 = [
      { text: '取消', onPress: () => { this.setState({ visible1: false });} },
      { text: '确认', onPress: () => {checkPassword('BackupPrompt')} },
    ];
    const checkPassword = (route) => {
      Wallet.openIdentity({password: enterPassword}).then(res => {
        Keyboard.dismiss();
        if (res.success) {
          const key = Toast.loading(route === 'AuthLoading' ? '身份注销中...' : '正在跳转...', 20);
          if (route === 'AuthLoading') {
            Wallet.destroy_identity().then(res => {
              dispatch({
                type: 'home/updateState',
                payload: {enterPassword: '' }
              });
              Portal.remove(key);
              navigation.navigate(route)
            })
          } else {
            model.home.Wallet.openIdentity({password: enterPassword}).then(res => {
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
              navigation.navigate(route)
            })
          }
        } else {
          Toast.fail('密码错误，请重新输入', 2)
        }
      })
    };
    const changePassword = (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {enterPassword: val }
      })
    };
    return (
      <Provider>
        <Modal
          title="请输入密码"
          transparent
          maskClosable
          visible={this.state.visible1}
          footer={footerButtons1}
          style={{position: 'absolute', top:20}}
        >
          <View style={s.input}>
            <TextInput textContentType='password' style={s.inputDiv} autoFocus={true}
                       onChangeText={changePassword} selectionColor={'#9d9d9d'} secureTextEntry={true}/>
          </View>
        </Modal>
        <Modal
          title="请输入密码"
          transparent
          maskClosable
          visible={this.state.visible}
          footer={footerButtons}
          style={{position: 'absolute', top:20}}
        >
          <Text style={{}}>警告： 注销钱包是清除此钱包，请确认是否保有助记词，否则会彻底失去此钱包。</Text>
          <View style={s.input}>
            <TextInput textContentType='password' style={s.inputDiv} autoFocus={true}
                       onChangeText={changePassword} selectionColor={'#9d9d9d'} secureTextEntry={true}/>
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
    alignItems: 'center', justifyContent: 'center', color: '#666'},
  inputDiv: {width: '100%',paddingLeft: 12, borderWidth: 0.5, height: 40, borderRadius: 5, borderColor: '#d8d8d8'},
});
export default connect(model => ({ model }))(SetIndex)
