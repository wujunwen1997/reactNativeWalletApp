import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Clipboard,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Provider, Icon, Toast } from '@ant-design/react-native';
import BackImage from "../../../components/headerView/backImage";

import { connect } from 'react-redux';
import Svg from "../../../components/Svg";
import Ficon from "../../../assets/Icomoon";

class Wallet extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '钱包',
      headerLeft: <BackImage event={() => {navigation.navigate('Home')}}/>,
    }
  };
  state = {
    loading: false
  };
  _keyExtractor = (item, index) => index.toString();
  componentDidMount() {
   this._onRefresh()
  }
  _onRefresh = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'home/get_balance',
      payload: {}
    })
  };
  render() {
    const {navigation, model, dispatch} = this.props;
    const {walletItem, getBlance_loading} = model.home;
    const {address, wallet_name} = walletItem;
    const goWalletDetail = (coin) => {
      dispatch({
        type: 'home/updateState',
        payload: {coin}
      })
      navigation.navigate('WalletDetail', {wallet_name})
    };
    const copyAddress = () => {
      Clipboard.setString(address);
      Toast.info('地址已复制', 2)
    };
    return (
      <Provider>
      <View style={s.container}>
        <StatusBar translucent={true} barStyle={'dark-content'} animated={true}/>
        <View style={s.card}>
          <View style={s.cardContent}>
            <View style={s.cardLeft}>
              <Text style={s.name}>{wallet_name}</Text>
              <Text style={s.ads}>
                {address}
              </Text>
              <Text style={s.ads} onPress={copyAddress}>
                <Ficon name={'fuzhi'} size={14} style={s.copyIcon}/> 复制地址
              </Text>
            </View>
          </View>
        </View>
        {
          model.home.assets &&　model.home.assets.length > 0 && <View style={s.title}>
            <Text style={s.zc}>资产</Text>
          </View>
        }
        <FlatList data={model.home.assets} keyExtractor={this._keyExtractor}
                  refreshControl={<RefreshControl refreshing={getBlance_loading} onRefresh={this._onRefresh}/>}
                  renderItem={({item}) =>
          <TouchableOpacity onPress={() => {goWalletDetail(item)}} activeOpacity={0.8}>
            <View style={s.assetItem}>
              <View style={s.assetItemLeft}>
                <Svg icon={item.icon} width={26} height={26}/>
                <Text style={s.coinName}>{item.coinname}</Text>
              </View>
              <View style={s.assetItemRight}>
                <Text style={s.assetNum}>{item.availableAmount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        }/>
      </View>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'flex-start', alignItems: 'center',},
  card: {width: '100%', height: 92,paddingLeft: 12, paddingRight: 12,marginTop: 16,},
  cardContent: {borderRadius: 5,backgroundColor: 'rgba(28,151,224,1)',
     padding: 12,flexDirection: 'row',height: 92,width: '100%'},
  cardLeft: {width: '100%',},
  name: {color: '#fff', fontSize: 16},
  ads: {color: '#fff', fontSize: 12, marginTop: 6},
  copyIcon: {height: 30, color: '#fff',},
  title: {borderBottomWidth: 0.8, borderBottomColor: '#EFEFEF',width: '100%',
    justifyContent: 'space-between',flexDirection: 'row',paddingLeft: 12,
  paddingRight: 32,paddingTop: 16, paddingBottom: 14},
  zc: {fontSize:16,color: '#333'},
  icon: {color: '#333'},
  assetItem: {height: 70,width: '100%',flexDirection: 'row',justifyContent: 'space-between',
    borderBottomWidth: 0.8,borderBottomColor: '#f9f9f9',},
  assetItemLeft: {width: '40%',height: 70, justifyContent: 'flex-start', paddingLeft:16,alignItems: 'center',
    flexDirection: 'row'},
  coinName: {fontSize:15, marginLeft: 12},
  assetItemRight: {width: '60%',height: 70,alignItems: 'flex-end',paddingRight: 33, justifyContent: 'center'},
  assetNum: {fontSize:15, color: '#999',},
  assetImg: {height: 28, width: 28,borderRadius: 28,marginRight: 8}
});
export default connect(model => ({ model }))(Wallet)
