import React, {Component} from 'react'
import {StyleSheet, Text, View, StatusBar, Clipboard} from 'react-native';
import { Provider, Icon, Toast, WingBlank } from '@ant-design/react-native';
import BackImage from "../../../components/headerView/backImage";
import QRCode from "react-native-qrcode-svg";
import {saveBase64Img} from "../../../utils";
import Ficon from "../../../assets/Icomoon";
import { connect } from 'react-redux';

class Receivables extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '收款',
      headerLeft: <BackImage event={() => {navigation.goBack()}}/>,
    }
  };
  render() {
    const {model} = this.props;
    const {walletItem, coin} = model.home;
    const wallet = walletItem;
    const {coinname} = coin;
    const copyAddress = () => {
      Clipboard.setString(wallet.address);
      Toast.info('地址已复制', 2)
    }
    const getDataURL = () => {
      this.img.toDataURL(callback);
    }
    const callback = (dataURL) => {
      saveBase64Img('data:image/png;base64,' + dataURL)
    }
    return (
      <Provider>
        <StatusBar translucent={true} barStyle={'dark-content'} animated={true}/>
        <WingBlank style={s.container}>
          <View style={s.rece}>
            <View style={s.ads}>
              <View style={{width: '80%'}}>
                <Text style={{ color: '#fff'}} numberOfLines={1}>{wallet.address}</Text>
              </View>
              <Text onPress={copyAddress}><Ficon name={'fuzhi'} size={16} color={'#fff'}/></Text>
            </View>
            <Text style={s.tip}>请转入{coinname}</Text>
            <View style={s.top}>
              <QRCode
                value={wallet.address} // 生成二维码的value
                size={120}  // 二维码大小
                color="#474747"  // 二维码主色
                backgroundColor="#FFF"   // 二维码背景色
                getRef={(c) => (this.img = c)}
                ecl="H"
              />
            </View>
            <View style={s.btnText}>
              <Text style={s.text1} onPress={getDataURL}>保存图片</Text>
            </View>
          </View>
        </WingBlank>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, alignItems: 'center',},
  rece: {height: 286,backgroundColor: '#1C97E0', borderRadius: 5,marginTop: 16,alignItems: 'center',
  width: '100%',},
  ads: {color: '#fff',fontSize:14,marginTop: 28, flexDirection: 'row', justifyContent: 'center'},
  tip: {fontSize: 15, color: '#fff', marginTop: 12,},
  top: {marginTop: 10, backgroundColor: '#fff' , height: 140, width: 140, alignItems: 'center', justifyContent: 'center'},
  btnText: {width: '100%', marginTop: 16,flexDirection: 'row', justifyContent: 'center'},
  text1: {width: '30%', color: '#fff',fontSize: 15, textAlign: 'center'},
});
export default connect(model => ({ model }))(Receivables)
