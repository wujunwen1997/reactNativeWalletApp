import React, {Component} from 'react'
import {StyleSheet, Text, View, StatusBar, TextInput, Keyboard} from 'react-native';
import {Button, WingBlank, Radio, Provider, Toast, Modal, Portal} from '@ant-design/react-native';
import HeaderView from "../../../components/headerView/index";
import BackImage from "../../../components/headerView/backImage";
import {btnDark, activeBtnDark, createUser} from "../../../styles/common";
import { connect } from 'react-redux';
import  {DeviceEventEmitter} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

const RadioItem = Radio.RadioItem;
const seasons = [
    {
      label: '兼顾交易确认速度和手续费率',
      key: 'MIDDLE',
    },
    {
      label: '交易确认速度优先',
      key: 'FAST',
    },
    {
      label: '低手续费',
      key: 'CHEAP',
    },
];
class Transfer extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('point') ? '指向' : '转账',
      headerLeft: <BackImage event={() => {navigation.goBack()}}/>,
      headerRight: <HeaderView color="#000" size={19} icon="saomiao" event={() => {navigation.navigate('Scanner', {back: 'Transfer', key: 'address'})}}/>,
    }
  };
  state = {
    loading: false,
    disabled: false,
    visible: false,
    code: '',
  };
  pinInput = React.createRef();
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  componentDidMount () {
    this.props.dispatch({
      type: 'home/updateState',
      payload: {
        feemode: 'MIDDLE',
        address: '',
        amount: ''
      }
    })
  }
  render() {
    const {dispatch, model, navigation} = this.props;
    const { code } = this.state;
    const {feemode, Wallet, address, amount, coin, walletItem} = model.home;
    const onChangeAmount = (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          amount: val
        }
      })
    };
    const onChangeAddress = (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          address: val
        }
      })
    };
    const chosePart = (num) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          feemode: num
        }
      })
    };
    const next = () => {
      if (isNaN(amount)  || amount === '') {
        Toast.fail('金额必须为数字', 1, '', false);
        return
      }
      if (navigation.getParam('point')) {
        if (amount < 1) {
          Toast.fail('金额必须大于1', 1, '', false)
          return
        }
      }
      if (address === '') {
        Toast.fail('请输入地址', 1, '', false);
        return;
      }
      this.setState({ visible: true });
    };
    const goOnTran = () => {
      this.setState({
        loading: true, disabled: true
      });
      const api = navigation.getParam('point') ? Wallet.create_pledge_loan : Wallet.create_transfer
      api({feemode, address, amount, coinId: coin.coinId, wallet: walletItem}).then(res => {
        this.setState({
          loading: false, disabled: false
        });
        const textFail = navigation.getParam('point') ? '指向失败' : '发送失败';
        const textSuccess = navigation.getParam('point') ? '指向成功' : '发送成功';
        if (!res.success) {
          const msg = res.errmsg ? `, ${res.errmsg}` : '';
          Toast.fail(textFail + msg, 2, '', false)
        } else {
          Toast.success(textSuccess, 1, '', false);
          navigation.getParam('point') ? DeviceEventEmitter.emit('newPoint') : DeviceEventEmitter.emit('new');
          navigation.goBack()
        }
      })
    }
    const _checkCode = (code, route) => {
      const {dispatch, model, navigation} = this.props;
      const {home} = model;
      this.setState({ code: '' });
      home.Wallet.openIdentity({password: code}).then(res => {
        if (res.success) {
          this.setState({ visible: false });
          goOnTran()
        } else {
          Keyboard.dismiss();
          this.pinInput.current.shake()
            .then(() => {
              Toast.fail('密码错误，请重新输入', 1, '', false)
            });
        }
      })
    }
    return (
      <Provider>
        <Modal
          title="请输入密码"
          transparent
          onClose={() => this.setState({ visible: false })}
          maskClosable
          visible={this.state.visible}
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
                                onFulfill={_checkCode}
            />
          </View>
        </Modal>
      <WingBlank style={s.container}>
        <StatusBar translucent={true} barStyle={'dark-content'} animated={true}/>
        <View style={s.top}>
          <View style={s.coin}>
            <Text style={s.coinName}>{coin.coinname}</Text>
            <Text style={s.coinNum}>余额: {coin.availableAmount} {coin.coinname}</Text>
          </View>
          <TextInput
            style={s.input}
            selectionColor={'#9d9d9d'}
            placeholder={navigation.getParam('point') ? '请输入金额，最小为1' : "输入金额"}
            onChangeText={onChangeAmount}
          />
          <View style={s.coin}>
            <Text style={s.coinName}>{navigation.getParam('point') ? '指向' : '收款'}地址</Text>
          </View>
          <TextInput
            style={s.input}
            selectionColor={'#9d9d9d'}
            placeholder="请输入有效的地址" value={address}
            onChangeText={onChangeAddress}
          />
          <View style={s.coin1}>
            <Text style={s.coinName}>手续费率模式</Text>
          </View>
            {
              seasons.map((u, index) => {
                return(
                  <RadioItem
                    key={index} style={s.item}
                    checked={feemode === u.key}
                    onChange={event => {chosePart(u.key)}}
                  >
                    <Text style={s.item}>{u.label}</Text>
                  </RadioItem>
                )
              })
            }
        </View>
        <View style={s.bottom}>
          <Button style={btnDark} type="primary" onPress={next} loading={this.state.loading}
                    disabled={this.state.disabled} activeStyle={activeBtnDark}>
            <Text style={createUser}>完成</Text>
          </Button>
        </View>
      </WingBlank>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between',},
  top: {width: '100%'},
  inputDiv: {width: '100%',paddingLeft: 12, borderWidth: 0.5, height: 40, borderRadius: 5, borderColor: '#d8d8d8'},
  coin: {width: '100%',justifyContent: 'space-between', flexDirection: 'row',marginTop: 16,height: 20,},
  coin1: {width: '100%',justifyContent: 'space-between', flexDirection: 'row',marginTop: 16,marginBottom: 12},
  coinName: {fontSize: 15, color: '#333'},
  coinNum: {fontSize: 14, color: '#358BFE'},
  input: {height: 40, backgroundColor: '#FFF', fontSize: 14,borderBottomWidth: 0.5,marginTop: 10,borderColor: '#EFEFEF',
  alignItems: 'center', justifyContent: 'center', color: '#666'},
  bottom: {marginBottom: 64},
  item: {borderWidth: 0, lineHeight: 30}
});
export default connect(model => ({ model }))(Transfer)
