import React, {Component} from 'react'
import {
  StyleSheet, Text, View, StatusBar,ActivityIndicator, ScrollView, Dimensions, TouchableOpacity, DeviceEventEmitter, RefreshControl} from 'react-native';
import { Button, Provider, Tabs } from '@ant-design/react-native';
import HeaderView from "../../../components/headerView/index";
import Receivables from "./Receivables";
import { connect } from 'react-redux';
import {filterLastZore} from '../../../utils/index';
import Ficon from '../../../assets/Icomoon';
import {activeStyle} from "../../../styles/common";

const height = Dimensions.get('window').height;
const obj = {
  pagenum: 0,
  pagesize: parseInt((height - 214)/66),
};
class WalletDetail extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('wallet_name') || '--',
      headerLeft: <HeaderView icon={'cuo'} size={20} color={'#FFF'} event={() => {navigation.goBack()}}/>,
    }
  };
  componentDidMount () {
    this.subscription = DeviceEventEmitter.addListener('new', () => {
      this.refreshData(1)
    });
    this.refreshData(0)
  }
  componentWillUnmount() {
    this.subscription.remove();
  };
  refreshData = (num) => {
    this.props.dispatch({
      type: 'home/get_balance'
    });
    this.props.dispatch({
      type: 'home/getThisWalletBlance'
    })
    this.props.dispatch({
      type: 'home/updateState',
      payload: {
        activeTab: num || 0
      }
    });
    this.onNextPage({deposit: obj, withdraw: obj,}, true)
  }
  onNextPage = (obj, isRefresh) => {
    const {dispatch, model} = this.props;
    const {coin, walletItem} = model.home;
    const data = {wallet: walletItem, coinid: coin.coinId, obj, isRefresh: isRefresh};
    dispatch({
      type: 'home/getWalletDetail',
      payload: data
    });
  };
  render() {
    const {dispatch, model, navigation} = this.props;
    const {home} = model;
    const {detailLoading, detailLoading1, walletDetail, depositArr, withdrawArr, activeTab, coin} = home;
    const {deposit, withdraw} = walletDetail;
    const goTransfer = () => {
      this.props.navigation.navigate('Transfer');
    };
    const goReceivables = () => {
      this.props.navigation.navigate('Receivables');
    };
    const changeTab = () => {
      dispatch({
        type: 'home/updateState',
        payload: {activeTab: activeTab === 0 ? 1 : 0, detailLoading: false}
      })
    };
    const nextPage = (event) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
      const scrollOffset = event.nativeEvent.contentOffset.y;
      const isEndReached = scrollOffset + scrollViewHeight >= contentHeight; // 是否滑动到底部
      const isContentFillPage = contentHeight >= scrollViewHeight; // 内容高度是否大于列表高度
      if (isContentFillPage && isEndReached) {
        if (!detailLoading) {
          const obj = {
            pagenum: activeTab ? withdraw.pagenum + 1 : deposit.pagenum + 1,
            pagesize: parseInt((height - 214)/66),
          };
          activeTab ? this.onNextPage({withdraw: obj, deposit}, false) : this.onNextPage({deposit: obj, withdraw}, false)
        }
      }
    };
    const goDetail = (u, send) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          transactionData: u
        }
      });
      this.props.navigation.navigate('TransactionDetail',
        {isSend: send === 1, data: u, coin, wallet: navigation.getParam('wallet')})
    };
    return (
      <Provider>
        <View style={s.container}>
          <StatusBar translucent={true} barStyle={'light-content'} animated={true}/>
          <View style={s.top}>
            <Text style={s.block}>{coin.availableAmount} {coin.coinname}</Text>
          </View>
          <View style={s.fullList}>
            <Tabs tabs={[{ title: '转入', }, { title: '转出', }]} onChange={changeTab}
                  page={activeTab} tabBarPosition="top" tabBarUnderlineStyle={{marginTop: 5}}
                  tabBarActiveTextColor={'#358BFE'} tabBarInactiveTextColor={'#333'}
                  tabBarTextStyle={{fontSize: 14}}>
              {
                [depositArr, withdrawArr].map((k,i) => {
                  if (k.length === 0) {
                    return(<Text key={i} style={s.nullData}>无数据...</Text>)
                  }
                  return (
                    <ScrollView key={i} showsVerticalScrollIndicator={false} onScrollEndDrag={nextPage} refreshControl={
                      <RefreshControl
                        title={'正在刷新...'} refreshing={detailLoading1}
                        colors={['#d1ced1',"#d1ced1"]}
                        onRefresh={() => {
                          this.refreshData(activeTab);
                        }}
                      />
                    }>
                      {k.map((u, i) => {
                        return (
                          <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => {goDetail(u, activeTab)}}>
                            <View style={s.listItem}>
                              <View style={s.listItemLeft}>
                                <Ficon name={ activeTab ? (u.hash || u.txHash) ? 'fasong' : 'daiqianming' : 'jieshou'} color={'#358BFE'} size={21}/>
                                <Text style={s.typeText}>
                                  {(u.hash || u.txHash) ? (u.hash || u.txHash).substr(0,8)+ '...' +(u.hash || u.txHash).substring((u.hash || u.txHash).length - 8) : '未完成签名'}
                                </Text>
                              </View>
                              <View style={s.listItemRight}>
                                {
                                  u.amount && <Text style={s.num}>{filterLastZore(u.amount).substr(0, 10)}{filterLastZore(u.amount).length>10 && '...'}</Text>
                                }
                                {
                                  (u.created || u.createTime) && <Text style={s.date}>{u.created || u.createTime}</Text>
                                }
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                      {detailLoading &&　<ActivityIndicator size="small" color="#efefef" />}
                    </ScrollView>
                  )
                })
              }
            </Tabs>
          </View>
          <View style={s.btnView}>
            <Button type="primary" style={s.btn} onPress={goReceivables} activeStyle={activeStyle}>
              <Ficon name={'shoukuan1'} color={'#358BFE'} size={16}/> <Text style={s.btnText}>收款</Text>
            </Button>
            <Text style={s.keep}>|</Text>
            <Button type="primary" style={s.btn1} onPress={goTransfer} activeStyle={activeStyle}>
              <Ficon name={'zhuanzhang'} color={'#358BFE'} size={17}/> <Text style={s.btnText}>转账</Text>
            </Button>
          </View>
        </View>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'flex-start', alignItems: 'center',},
  top: {height: 80, width: '100%',backgroundColor: '#1C97E0',alignItems: 'center'},
  block: {color: '#fff',fontSize: 22,marginTop: 3},
  listItem: {width: '96%', height: 76, borderBottomWidth: 0.8, borderBottomColor: '#f3f3f3',marginLeft: '2%',
  justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'},
  listItemLeft: {flexDirection: 'row',},
  typeText: {color: '#666666', marginLeft: 12, marginTop: 2},
  fullList: { marginTop: 6, width: '100%', height: height - 214},
  listItemRight: {justifyContent: 'flex-start', flex: 1, },
  num: {fontSize:16,color: '#666',marginBottom:14,textAlign: 'right', zIndex: 999999999,},
  date: {fontSize: 12, color: '#999',textAlign: 'right'},
  btnView: { position: 'absolute', bottom:-1, left: 0,width: '100%',justifyContent:'space-between',backgroundColor: '#F5F5F5',
    height: 50, flexDirection: 'row'},
  btn: {width: '49%', borderRadius: 0,height: 50, borderWidth: 0,backgroundColor: '#F5F5F5',},
  btn1: {width: '49%', borderRadius: 0,height: 50, borderWidth: 0,backgroundColor: '#F5F5F5',},
  nullData: {textAlign: 'center', marginTop: 20},
  btnText: {color: '#358BFE', fontSize: 16},
  keep:{ textAlign: 'center', lineHeight: 50, fontSize: 16,color: '#81aefd',}
});
export default connect(model => ({ model }))(WalletDetail)
