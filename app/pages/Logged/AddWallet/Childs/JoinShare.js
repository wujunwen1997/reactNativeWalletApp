import React, {Component} from 'react'
import {StyleSheet, Text, View, TextInput, Picker, Image, KeyboardAvoidingView, Keyboard} from 'react-native';
import {Button, Provider, WingBlank, Toast } from '@ant-design/react-native';
import { connect } from 'react-redux';
import {activeBtnDark, btnDark, createUser} from "../../../../styles/common";
import Ficon from '../../../../assets/Icomoon';
import BackImage from "../../../../components/headerView/backImage";

class JoinShare extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '加入分享钱包',
      headerLeft: <BackImage color={'#fff'} event={() => {navigation.goBack()}}/>,
    }
  };
  state = {
    disabled: false, loading: false
  };
  componentDidMount (){
    this.props.dispatch({
      type: 'home/updateState',
      payload: {joinShare: {barcode: ''}}
    })
  }
  render() {
    const {dispatch, model, navigation } = this.props;
    const {home} = model;
    const { barcode } = home.joinShare;
    const onChangeKey= (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {joinShare: {barcode: val}}
      })
    }
    const createMultiSignature = () => {
      Keyboard.dismiss();
      if (!barcode) {
        Toast.info('请输入邀请码', 1, '', false);
        return
      }
      this.setState({loading: true, disabled: true});
      home.Wallet.join_shared_wallet(barcode).then(res => {
        const coinName = home.coinTypes.find(u => (u.type === res.cointype)).symbol;
        this.setState({loading: false, disabled: false });
        if (res.success) {
            dispatch({
              type: 'home/getMultiSignatureStatus2',
              payload: {
                wallet: res, navigation,
                coinName
              }
            });
        } else {
          const msg = res.errmsg ? `, ${res.errmsg}` : '';
          Toast.fail('加入失败' + msg, 1, '', false)
        }
      })
    }
    const goRestore = () => {
      this.props.navigation.navigate('Scanner', {back: 'JoinShare', key: ['joinShare', 'barcode']})
    }
    return (
      <Provider>
        <View style={s.container}>
          <View>
            <View style={s.line}>
              <TextInput value={barcode}
                style={Object.assign({}, s.input, {width: '90%'})}
                selectionColor={'#9d9d9d'}
                placeholder="钱包邀请码"
                onChangeText={onChangeKey}
              />
              <Ficon onPress={goRestore} name={'saomiao'} size={18} style={{color: '#858585', marginRight: 10}}/>
            </View>
          </View>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20}>
            <WingBlank style={s.btn}>
              <Button style={btnDark} type="primary" onPress={createMultiSignature} loading={this.state.loading}
                    disabled={this.state.disabled} activeStyle={activeBtnDark}>
                <Text style={createUser}>加入</Text>
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
  btn: {marginBottom: 64},
  line: {borderTopWidth: 1,height: 60, backgroundColor: '#fff', borderTopColor: '#EFEFEF',flexDirection: 'row',
  alignItems: 'center', justifyContent: 'space-between'}
});
export default connect(model => ({ model }))(JoinShare)
