import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Clipboard,
  ScrollView,
  DeviceEventEmitter,
  Dimensions
} from 'react-native';
import { Button, WingBlank, Provider, Toast} from '@ant-design/react-native';
import {activeBtnDark, btnDark, createUser} from "../../../../styles/common";
import { connect } from 'react-redux';
import HeaderView from "../../../../components/headerView";
import QRCode from 'react-native-qrcode-svg';
import {saveBase64Img} from '../../../../utils/index.js'
import Ficon from "../../../../assets/Icomoon";
const height = Dimensions.get('window').height;
export class WalletConfig extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name').wallet_name || '--',
      headerLeft: <HeaderView icon={'cuo'} size={20} color={'#FFF'} event={() => {
        DeviceEventEmitter.emit('newList', navigation.getParam('name'));
        navigation.navigate('Home');
      }}/>,
    }
  };
  state = {
    loading: false,
    disabled: false,
    state: null
  };
  componentDidMount () {
    const {model, dispatch, navigation} = this.props;
    this.state.timer = setInterval(() => {
      model.home.Wallet.join_status(this.props.navigation.getParam('name')).then(res => {
        if (!res.success) {
          const msg = res.errmsg ? `, ${res.errmsg}` : '';
          // alert('wallet_name')
          Toast.fail('获取多重签名status失败' + msg, 1, '', false)
        } else {
          if (res.status.length === parseInt(res.number_of_multisign)) {
            clearInterval(this.state.timer);
            const coinName = model.home.coinTypes.find(u => (u.type === res.cointype)).symbol;
            dispatch({
              type: 'home/updateState',
              payload: {
                MultiSignatureStatus: {
                  join_barcode: res.join_barcode,
                  number_of_multisign: res.number_of_multisign,
                  required_sign: res.required_sign,
                  status: res.status
                },
                walletItem: res, coinName
              }
            });
            dispatch({
              type: 'home/getWalletList'
            })
            navigation.navigate('WalletHome')
          }
        }
      })
    }, 3000)
  }
  componentWillUnmount() {
    if(this.state.timer!= null) {
      clearInterval(this.state.timer);
    }
  };
  render() {
    const {dispatch, model, navigation} = this.props;
    const {home} = model;
    const {join_barcode, number_of_multisign, status} = home.MultiSignatureStatus;
    const copyAddress = () => {
      Clipboard.setString(join_barcode);
      Toast.info('地址已复制', 1, '', false)
    };
    const getDataURL = () => {
      this.svg.toDataURL(callback);
    };
    const callback = (dataURL) => {
      saveBase64Img('data:image/png;base64,' + dataURL)
    };
    const offJoin = () => {
      this.setState({loading: true, disabled: true  });
      home.Wallet.delete_shared_wallet(join_barcode).then(res => {
        this.setState({loading: false, disabled: false  });
        if (res.success) {
          dispatch({
            type: 'home/getWalletList',
            payload: ''
          });
          navigation.navigate('Home');
        } else {
          const msg = res.errmsg ? `, ${res.errmsg}` : '';
          Toast.fail('取消失败' + msg, 1, '', false)
        }
      })
    };
    return (
      <Provider>
        <WingBlank style={s.container}>
          <View style={s.tops}>
            <View style={s.top}>
              {
                join_barcode &&　<QRCode
                  value={join_barcode} // 生成二维码的value
                  size={166}  // 二维码大小
                  color="#7f7f7f"  // 二维码主色
                  backgroundColor="white"   // 二维码背景色
                  getRef={(c) => (this.svg = c)}
                />
              }
              <Text onLongPress={getDataURL} style={s.tip}>长按这段文字保存二维码</Text>
            </View>
            <Text style={s.walletAddress}>
              加入链接
            </Text>
            <View style={s.copyAddress}>
              <Text style={{flexWrap: 'wrap', fontSize: 14}} numberOfLines={1}>
                {join_barcode}
              </Text>
            </View>
            <View style={{marginTop: 6}}>
              <Text style={s.copyText} onPress={copyAddress}>
                <Ficon name={'fuzhi'} size={14} style={s.copyIcon}/> 复制地址
              </Text>
            </View>
            <Text style={s.join}>已加入 ({status.length}/{number_of_multisign})</Text>
            <View style={{height: height - 500}}>
              <ScrollView showsVerticalScrollIndicator={false} style={{zIndex: 999}}>
                {
                  status.map((u, index) => {
                    return(
                      <Text style={s.joinName} key={index}><Ficon name={'duihao'} size={15} style={s.icon}/>   {u} 已加入</Text>
                    )
                  })
                }
              </ScrollView>
            </View>
          </View>
          {/*<Button style={Object.assign({}, btnDark, s.btn)} type="primary" onPress={offJoin} loading={this.state.loading}*/}
                  {/*disabled={this.state.disabled} activeStyle={activeBtnDark}>*/}
            {/*<Text style={createUser}>取消邀请</Text>*/}
          {/*</Button>*/}
        </WingBlank>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF', justifyContent: 'space-between' },
  top: {height: 230,alignItems:'center',marginTop: 30, width: '100%',},
  walletAddress: {color: '#333333',fontSize: 14,},
  copyAddress: {width: '100%', fontSize: 14, color: '#999', marginTop: 6,},
  copyText: {color: '#358BFE',fontSize: 13,},
  copyIcon: { color: '#358BFE'},
  tip: {marginTop:24, color: '#999999', fontSize: 13},
  join: {color: '#333333',fontSize: 14,marginTop: 10, marginBottom: 10},
  icon: {color: '#358BFE', },
  joinName: {color: '#358BFE', marginBottom: 3},
  btn: { justifyContent: 'center', marginBottom: 6},
  tops: {height: height - 150}
});
export default connect(model => ({ model }))(WalletConfig)
