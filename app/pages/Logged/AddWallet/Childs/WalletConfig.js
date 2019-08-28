import React, {Component} from 'react'
import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Keyboard} from 'react-native';
import { Button, WingBlank, Provider, Toast } from '@ant-design/react-native';
import {activeBtnDark, btnDark, createUser} from "../../../../styles/common";
import { connect } from 'react-redux';
import BackImage from "../../../../components/headerView/backImage";

export class WalletConfig extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '钱包配置',
      headerLeft: <BackImage color={'#fff'} event={() => {navigation.goBack()}}/>,
    }
  };
  state = {
    walletType: '',
    loading: false,
    disabled: false
  }
  componentDidMount (){
    const { navigation, dispatch, model } = this.props;
    const type = navigation.getParam('type');
    if (type !== 0) {
      if (type === '' || !type){
        Toast.fail('钱包类型为空，请返回选择货币页面', 1, '', false);
      }
    }
    dispatch({
      type: 'home/updateState',
      payload: {walletConfig: {cointype: type, walletName: ''}}
    })
  }
  render() {
    const {dispatch, model, navigation} = this.props;
    const {home} = model;
    const onChangeText = (text) => {
      dispatch({
        type: 'home/updateState',
        payload: {walletConfig: Object.assign({}, home.walletConfig, {wallet_name: text})}
      })
    }
    const createIdentity = () => {
      Keyboard.dismiss();
      if (home.walletConfig.cointype !== 0) {
        if (!home.walletConfig.cointype || home.walletConfig.cointype === '') {
          Toast.fail('钱包类型为空，请返回选择货币页面', 1, '', false);
          return;
        }
      }
      if (!home.walletConfig.wallet_name) {
       Toast.info('钱包名不能为空!', 1, '', false);
        return;
      }
      if (home.walletConfig.wallet_name.length > 20) {
        Toast.info('钱包名长度小于20', 1, '', false);
        return;
      }
      this.setState({loading: true, disabled: true});
      home.Wallet.create_wallet(home.walletConfig).then(res => {
        this.setState({loading: false, disabled: false });
        if (res.wallet_name) {
          dispatch({
            type: 'home/getWalletList',
            payload: ''
          });
          dispatch({
            type: 'home/updateState',
            payload: {
              walletItem:res
            }
          });
          navigation.navigate('WalletHome');
        } else {
          const msg = res.errmsg ? `, ${res.errmsg}` : '';
          Toast.fail('创建失败' + msg, 1, '', false)
        }
      })
    };
    return (
      <Provider>
      <View style={s.container}>
        <TextInput
          style={s.input} autoFocus={true}
          selectionColor={'#9d9d9d'}
          placeholder="钱包名称"
          onChangeText={onChangeText}
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20}>
          <WingBlank style={s.btn}>
              <Button style={btnDark} type="primary" onPress={createIdentity} loading={this.state.loading}
                      disabled={this.state.disabled} activeStyle={activeBtnDark}>
                <Text style={createUser}>创建</Text>
              </Button>
          </WingBlank>
        </KeyboardAvoidingView>
      </View>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F6F6F6',justifyContent: 'space-between'},
  input: {height: 50, backgroundColor: '#FFF', fontSize: 14, paddingLeft: 20, color: '#787878'},
  text: {color: '#333333', fontSize: 16, marginLeft: 18},
  icon: {marginLeft: 32,},
  btn: {marginBottom: 64}
});
export default connect(model => ({ model }))(WalletConfig)
