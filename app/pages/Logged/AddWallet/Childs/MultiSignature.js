import React, {Component} from 'react'
import Slider from "react-native-slider";
import {StyleSheet, Text, View, TextInput, Picker, Image, KeyboardAvoidingView, Keyboard} from 'react-native';
import {Button, Provider, WingBlank, Toast, PickerView } from '@ant-design/react-native';
import { connect } from 'react-redux';
import {activeBtnDark, btnDark, createUser} from "../../../../styles/common";
import BackImage from "../../../../components/headerView/backImage";
class MultiSignature extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '多重签名',
      headerLeft: <BackImage color={'#fff'} event={() => {navigation.goBack()}}/>,
    }
  };
  state = {
    disabled: false, loading: false
  };
  componentDidMount (){
    const { navigation, dispatch, model } = this.props;
    const type = navigation.getParam('type');
    if (type !== 0) {
      if (type === '' || !type){
        Toast.fail('钱包类型为空，请返回选择货币页面', 2);
      }
    }
    dispatch({
      type: 'home/updateState',
      payload: {MultiSignature: Object.assign({
          cointype: '',
          wallet_name: '',
          nKeys: 4,
          nRequired: 2,
        }, {cointype: type})}
    })
  }
  render() {
    const {dispatch, model, navigation} = this.props;
    const {home} = model;
    const { wallet_name,nKeys,nRequired, cointype } = home.MultiSignature;
    const onChangeText= (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {MultiSignature: Object.assign({}, home.MultiSignature, {wallet_name: val})}
      })
    };
    const onchangeCopayers= (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {MultiSignature: Object.assign({}, home.MultiSignature, {nKeys: val})}
      })
    };
    const onChangeNeedNum= (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {MultiSignature: Object.assign({}, home.MultiSignature, {nRequired: val})}
      })
    };
    const createMultiSignature = () => {
      Keyboard.dismiss();
      if (cointype !== 0) {
        if (!cointype || cointype === '') {
          Toast.fail('钱包类型为空，请返回选择货币页面', 2);
          return;
        }
      }
      if (!wallet_name) {
        Toast.info('钱包名不能为空!', 2);
        return;
      }
      if (wallet_name.length > 20) {
        Toast.info('钱包名长度小于20', 2);
        return;
      }
      this.setState({loading: true, disabled: true});
      home.Wallet.create_shared_wallet(home.MultiSignature).then(res => {
        this.setState({loading: false, disabled: false });
        if (res.join_barcode) {
          dispatch({
            type: 'home/getWalletList',
            payload: {}
          });
          dispatch({
            type: 'home/getMultiSignatureStatus',
            payload: {res, navigation}
          });
        } else {
          const msg = res.errmsg ? `, ${res.errmsg}` : '';
          Toast.fail('创建失败' + msg, 2)
        }
      })
    };
    return (
      <Provider>
      <View style={s.container}>
        <View>
          <TextInput
            style={s.input} autoFocus={true}
            selectionColor={'#9d9d9d'}
            placeholder="钱包名称"
            onChangeText={onChangeText}
          />
          <View style={s.mockInput}>
            <View style={s.inputLabel}>
              <Text style={s.text}>Copayers总数: </Text>
              <Text style={s.num}>{nKeys}</Text>
            </View>
            <Slider maximumValue={6} minimumValue={2} step={1} value={parseInt(nKeys)}
                    style={s.slider} thumbTintColor={'#1C97E0'} onValueChange={onchangeCopayers}
                    minimumTrackTintColor={'#1C97E0'} trackStyle={{height: 1}}/>
          </View>
          <View style={s.mockInput}>
            <View style={s.inputLabel}>
              <Text style={s.text}>所需的签名总数:</Text>
              <Text style={s.num}>{nRequired}</Text>
            </View>
            <Slider maximumValue={3} minimumValue={1} step={1} value={parseInt(nRequired)}
                    style={s.slider} thumbTintColor={'#1C97E0'} onValueChange={onChangeNeedNum}
                    minimumTrackTintColor={'#1C97E0'} trackStyle={{height: 1}}/>
          </View>
        </View>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20}>
          <WingBlank style={s.btn}>
            <Button style={btnDark} type="primary" onPress={createMultiSignature} loading={this.state.loading}
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
  mockInput: {flexDirection: 'row',  alignItems: 'center',
  backgroundColor: '#fff', height: 60, borderTopWidth: 0.8, borderTopColor: '#f8f8f8',paddingLeft: 20},
  inputLabel: {width: '40%', alignItems: 'center', flexDirection: 'row',
  paddingRight: 30},
  text: {fontSize: 14, color: '#999999'},
  num: {fontSize: 14,marginLeft: 20},
  btn: {marginBottom: 64},
  slider: {width: '50%'}
});
export default connect(model => ({ model }))(MultiSignature)
