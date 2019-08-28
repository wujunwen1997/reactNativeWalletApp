import React, {Component, Fragment} from 'react'
import {
  StyleSheet,
  Text,
  View,
  StatusBar, Dimensions, Clipboard, DeviceEventEmitter,
} from 'react-native';
import {filterLastZore} from '../../../utils/index';
import BackImage from "../../../components/headerView/backImage";
import Ficon from "../../../assets/Icomoon";
import {Button, Provider, Toast} from "@ant-design/react-native";
import { connect } from 'react-redux';
import {activeStyle} from "../../../styles/common";

class WalletDetail extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('isSend') ? '发送资金' : '接收资金',
      headerLeft: <BackImage event={() => {navigation.goBack()}}/>,
    }
  };
  state = {
    disabled: false, loading: false,
    disabled1: false, loading1: false
  };
  render() {
    const {navigation, model} = this.props;
    const {Wallet, walletItem, identity} = model.home;
    const isSend = navigation.getParam('isSend');
    const wallet = walletItem;
    const withdraw_history_item = navigation.getParam('data');
    const coin = navigation.getParam('coin');
    const {required_sign} = wallet;
    const data = withdraw_history_item;
    const onCancel = () => {
      this.setState({
        loading: true, disabled: true
      });
      Wallet.cancel_transfer(withdraw_history_item).then(res => {
        this.setState({
          loading: false, disabled: false
        });
        if (!res.success) {
          const msg = res.errmsg ? `, ${res.errmsg}` : '';
          Toast.fail('取消失败' + msg, 1, '', false)
        } else {
          Toast.success('取消成功', 1, '', false);
          DeviceEventEmitter.emit('new');
          navigation.goBack()
        }
      })
    };
    const onAutograph = () => {
      this.setState({
        loading1: true, disabled1: true
      });
      Wallet.sign_transfer({wallet, withdraw_history_item}).then(res => {
        this.setState({
          loading1: false, disabled1: false
        });
        if (!res.success) {
          const msg = res.errmsg ? `, ${res.errmsg}` : '';
          Toast.fail('签名失败' + msg, 1, '', false)
        } else {
          Toast.success('签名成功', 1, '', false);
          DeviceEventEmitter.emit('new');
          navigation.goBack()
        }
      })
    };
    const copyAddress = () => {
      Clipboard.setString(data.toAddress);
      Toast.info('地址已复制', 1, '', false)
    };
    const copyTxHash = () => {
      Clipboard.setString(data.txHash || data.hash);
      Toast.info('交易Hash已复制', 1, '', false)
    };
    const getHtmlResove = () => {
      if (!isSend) {
        return <Text/>
      }
      return(
        <Fragment>
          <View style={s.Cost}>
            <Text style={s.tip2}>费用</Text>
            <Text style={s.money}>{data.fee} {data.platformCoin}</Text>
          </View>
          <View style={s.send}>
            <Text style={s.tip2}>发送到</Text>
            <Text style={s.money} onPress={copyAddress}>{data.toAddress && data.toAddress}</Text>
          </View>
        </Fragment>
      )
    };
    const onlyCanel = () => {
      return(
        <View style={s.btnView}>
          <Button type="primary" style={s.btn2} onPress={onCancel} activeStyle={activeStyle}
                  loading={this.state.loading} disabled={this.state.disabled}>
            <Text style={s.btnText}>取消发送</Text>
          </Button>
        </View>
      )
    };
    const Btn = () => {
      return(
        <View style={s.btnView}>
          <Button type="primary" style={s.btn} onPress={onCancel} activeStyle={activeStyle}
                  loading={this.state.loading} disabled={this.state.disabled}>
            <Text style={s.btnText}>取消发送</Text>
          </Button>
          <Text style={s.keep}>|</Text>
          <Button type="primary" style={s.btn1} onPress={onAutograph} activeStyle={activeStyle}
                  loading={this.state.loading1} disabled={this.state.disabled1}>
            <Text style={s.btnText}>签名发送</Text>
          </Button>
        </View>
      )
    };
    const have = () => {
      if (data.sigUserList && data.sigUserList.length === required_sign) {
        return null
      }
      const is = data.sigUserList.find((d) => (d.seedHash === identity));
      return !!is ? onlyCanel() : Btn()
    };
    const getNum = () => {
      return data.sigUserList && data.sigUserList.length + '/' + required_sign
    };
    const isNotView = () => {
      return !(isSend && !data.sigUserList)
    };
    return (
      <Provider>
        <View style={s.container}>
          <StatusBar translucent={true} barStyle={'dark-content'} animated={true}/>
          {
            data && <View>
              <View style={s.top}>
                <Text style={s.tip}>{isSend ? '已发送' : '已接收'}</Text>
                <View style={s.fee}>
                  <View style={s.btc}>
                    <Text style={s.num}>{data.amount && filterLastZore(data.amount)}</Text>
                    <Text style={s.coin}>{coin && coin.coinname}</Text>
                  </View>
                </View>
              </View>
              {
                getHtmlResove()
              }
              <View style={s.txHashView}>
                <Text style={s.tip2}>交易Hash</Text>
                <Text numberOfLines={1} style={s.txHash} onPress={copyTxHash}>{data.txHash || data.hash || 'null'}</Text>
              </View>
              <View style={s.line1}>
                <Text style={s.tip}>日期</Text>
                <Text style={s.money}>{data.created || data.createTime}</Text>
              </View>
              {
                isNotView() && <View style={s.line1}>
                  <Text style={s.tip}>{data.sigUserList ? '已获得签名' : '确认'}</Text>
                  <Text style={s.money}>{data.sigUserList ? getNum() : data.notifiedConfirmNum}</Text>
                </View>
              }
              {
                isSend && data.sigUserList && <View style={s.list}>
                  {
                    data.sigUserList.map(u => {
                      return(
                        <View style={s.names} key={u.seedHash}>
                          <Text ><Ficon name={'duihao'} size={15}/>   {u.name} 已签名 </Text>
                          <Text>{u.time}</Text>
                        </View>
                      )
                    })
                  }
                </View>
              }
            </View>
          }
          {
            data.sigUserList && isSend && have()
          }
        </View>
      </Provider>
    )
  }
}
const common = {height: 46,borderBottomWidth: 0.8, borderBottomColor: '#f8f8f8', flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 12};
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between'},
  top: {height: 90,paddingLeft: 12, paddingRight: 12, paddingTop: 14, borderBottomWidth:0.7, borderBottomColor: '#f7f7f7',},
  tip: {color: '#333'},
  tip2: {color: '#333', marginBottom: 6},
  fee: {display: 'flex', flexDirection: 'row', width: '100%',justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
  btc: {flexDirection: 'row',alignItems: 'center' },
  num: {color: '#358BFE', fontSize: 26},
  coin: {color: '#358BFE', marginLeft: 12},
  Cost: {height: 60,paddingLeft: 12,paddingTop: 11},
  money: {color: '#999', lineHeight: 20},
  txHash: {color: '#999', lineHeight: 20, },
  txHashView: {borderBottomWidth:0.7, borderBottomColor: '#f7f7f7', height: 70,paddingLeft: 12,paddingTop: 11},
  send: {height: 68,borderBottomWidth: 0.7,paddingLeft: 12,paddingTop: 6, borderBottomColor: '#f7f7f7',},
  line: common,
  line1: Object.assign({}, common, {justifyContent: 'space-between'}),
  list: {paddingLeft: 12, paddingRight: 12,borderBottomWidth: 0.8, borderBottomColor: '#f8f8f8',paddingTop: 8, paddingBottom: 8},
  btnView: { position: 'absolute', bottom:-1, left: 0,width: '100%',justifyContent:'space-between',backgroundColor: '#F5F5F5',
    height: 50, flexDirection: 'row'},
  btn: {width: '49%', borderRadius: 0,height: 50, borderWidth: 0,backgroundColor: '#F5F5F5',},
  btn1: {width: '49%', borderRadius: 0,height: 50, borderWidth: 0,backgroundColor: '#F5F5F5',},
  btn2: {width: '100%', borderRadius: 0,height: 50, borderWidth: 0,backgroundColor: '#F5F5F5',},
  nullData: {textAlign: 'center', marginTop: 20},
  btnText: {color: '#358BFE', fontSize: 16},
  keep:{ textAlign: 'center', lineHeight: 50, fontSize: 16,color: '#81aefd',},
  names: {justifyContent: 'space-between', flexDirection: 'row'}
});
export default connect(model => ({ model }))(WalletDetail)
