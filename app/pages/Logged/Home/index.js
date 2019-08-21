import React, {Component} from 'react'
import {
  TouchableOpacity, RefreshControl, StyleSheet, Text, View, StatusBar, ActivityIndicator,
  ScrollView, Dimensions, DeviceEventEmitter, Linking, Image,Platform
} from 'react-native';
import { Button, Provider, Icon } from '@ant-design/react-native';
import HeaderView from '../../../components/headerView/index'
import BoxShadow from '../../../components/BoxShadow/index'
import { connect } from 'react-redux';
import Svg from '../../../components/Svg';
import Ficon from '../../../assets/Icomoon';

const width = Dimensions.get('window').width;
class HomeIndex extends Component {
  static navigationOptions = ({navigation}) => {
    return {
     title: '链付钱包',
     headerRight: <HeaderView color="#f3f3f3" size={19} icon="shezhi1" event={() => {navigation.navigate('AppSet')}}/>,
     headerLeft: <HeaderView color="#f3f3f3" size={17} icon="tianjia" event={() => {navigation.navigate('AddIndex')}}/>,
    }
  };
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'home/getWalletList'
    });
    this.subscription = DeviceEventEmitter.addListener('newList', (param) => {
      this.props.dispatch({
        type: 'home/getMultiSignatureStatus2',
        payload: {
          wallet: param,
          notGoGet: true,
          navigation: this.props.navigation
        }
      });
      dispatch({
        type: 'home/getWalletList'
      })
    });
  }
  componentWillUnmount() {
    this.subscription.remove();
  };
  render() {
    const {dispatch, model, navigation} = this.props;
    const {home} = model;
    const onChangeShowThis = (u, i) => {
      if (u.arr.length < 3) return;
      let arr = home.walletArr;
      arr[i].show = !u.show;
      dispatch({
        type: 'home/updateState',
        payload: {
          walletArr:arr
        }
      })
    };
    const goWallet = (wallet) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          walletItem:wallet
        }
      });
      if (wallet.address && wallet.address !== '') {
        navigation.navigate('WalletHome')
      } else {
        dispatch({
          type: 'home/getMultiSignatureStatus2',
          payload: {wallet, navigation}
        })
      }
    };
    const onRefresh = () => {
      dispatch({
        type: 'home/getWalletList'
      })
    };
    const centerList = (u, i) => {
      return(
        <View style={s.content}>
        <TouchableOpacity onPress={() => onChangeShowThis(u, i)}
                          activeOpacity={u.arr.length > 2 ? 0.8 : 1}>
          <View style={s.title}>
            <View style={s.leftCon}>
              <Svg style={s.icon} icon={u.name} width={26} height={26}/>
              <Text style={s.text}>{u.name}钱包</Text>
            </View>
            {
              u.arr.length > 2 && <Ficon name={u.show ? 'up' : 'xia'} style={s.down}/>
            }
          </View>
        </TouchableOpacity>
        {
          (u.show ? u.arr : u.arr.slice(0, 2)).map((item,i) => {
            return(
              <TouchableOpacity onPress={() => goWallet(item)} key={i} style={s.wallet}
                                activeOpacity={u.arr.length > 2 ? 0.8 : 1}>
                <View style={s.leftCon}>
                  <Ficon name={'qianbaoming'} style={s.wIcon} size={22} color={'#358BFE'}/>
                  <Text style={s.wName}>{item.wallet_name}</Text>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </View>
      )
    }
    const getIos = (u, i) => {
      if (Platform.OS === 'ios') {
          return(
            <View height={((u.show ? u.arr : (u.arr.length > 1 ? [1, 1] : [1])).length + 1) * 54}
                   width={width-24} style={{shadowColor: '#333', shadowOpacity: 0.2,
                   shadowRadius: 2, shadowOffset:{width: 0, height: 0}}}>
               {centerList(u, i)}
                  </View>
          )
      } else {
        return(
          <BoxShadow height={((u.show ? u.arr : (u.arr.length > 1 ? [1, 1] : [1])).length + 1) * 54}
                     width={width-24}>
            {centerList(u, i)}
          </BoxShadow>
        )
      }
    }
    const isHaveWallet = () => {
      return(
        <ScrollView showsVerticalScrollIndicator={false} style={{zIndex: 999,}}
                    refreshControl={
                      <RefreshControl
                        refreshing={home.homeLoading}
                        onRefresh={onRefresh}
                      />
                    }
        >
          {
            home.walletArr.map((u, i)=> {
              return(
                <View style={{paddingLeft: 12, paddingRight: 12,}} key={i}>
                  {
                    getIos(u, i)
                  }
                </View>
              )
            })
          }
        </ScrollView>
      )
    };
    const isNotHaveWallet = () => {
      return(
        <View style={s.nullView}>
          <Image source={require('../../../assets/images/r7.png')} style={{width: 300, height: 300}} />
          <Text style={s.tipText}>暂时还没有钱包呢， 可以左上角添加哦～</Text>
        </View>
      )
    };
    const getView = () => {
      return home.walletArr.length > 0 ? isHaveWallet() : isNotHaveWallet()
    };
    return (
      <Provider>
        <View style={s.container}>
          <StatusBar animated={true} barStyle={'light-content'} translucent={true}/>
          {home.walletArr.length > 0 ? <View style={s.blue}/> : <View style={{height: 70}}/> }
          <View style={s.list}>
            {
              home.homeLoading ? <ActivityIndicator size="large" color="#EEE" /> : getView()
            }
          </View>
        </View>
      </Provider>
    )
  }
}
const commonFlex = {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',};
const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF',},
  blue: {backgroundColor: '#1C97E0', height: 70},
  list: {flex: 1, marginTop: -60,zIndex: 999,alignItems: 'center'},
  content: {backgroundColor: '#fff',height: '100%',borderRadius: 3,width: '100%'},
  title: {height: 54, borderBottomWidth: 0.8, borderBottomColor: '#f9f9f9',...commonFlex, paddingRight: 10},
  icon: {marginLeft: 20,},
  down: {padding: 6, color: '#358BFE',marginTop: 4},
  text: {marginLeft: 20, color: '#333', fontSize: 14,},
  leftCon: {flex:  1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'},
  wallet: {flex: 1, ...commonFlex,height: 54,},
  wIcon: {marginLeft: 50},
  wName: {marginLeft: 12,color: '#333',fontSize: 13},
  nullView: {width: '90%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 180},
  tipText: {color: '#999999',fontSize: 14}
});
export default connect(model => ({ model }))(HomeIndex)
