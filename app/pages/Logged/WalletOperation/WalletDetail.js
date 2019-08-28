import React, {Component} from 'react'
import {
  StyleSheet, Text, View, StatusBar, Dimensions, DeviceEventEmitter } from 'react-native';
import { Button, Provider } from '@ant-design/react-native';
import HeaderView from "../../../components/headerView/index";
import Receivables from "./Receivables";
import { connect } from 'react-redux';
import Ficon from '../../../assets/Icomoon';
import {activeStyle} from "../../../styles/common";
import TabViews from '../../../components/TabView'

const height = Dimensions.get('window').height;
const obj = {
  pagenum: 0,
  pagesize: parseInt((height - 162)/66),
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
    this.props.dispatch({
      type: 'home/updateState',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'home/updateState',
      payload: {
        depositArr: [],
        withdrawArr: [],
        activeTab: 0
      }
    })
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
    const transferArr = [{arr: depositArr, til: '转入'}, {arr: withdrawArr, til: '转出'}, {arr: withdrawArr, til: '指向'}];
    const goTransfer = () => {
      navigation.navigate('Transfer');
    };
    const goPoint = () => {
      navigation.navigate('Transfer', {point: true});
    };
    const goReceivables = () => {
      navigation.navigate('Receivables');
    };
    const changeTab = (i) => {
      dispatch({
        type: 'home/updateState',
        payload: {activeTab: i}
      })
      this.refreshData(i)
    };
    const nextPage = (event) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
      const scrollOffset = event.nativeEvent.contentOffset.y;
      const isEndReached = scrollOffset + scrollViewHeight + 1 >= contentHeight; // 是否滑动到底部
      const isContentFillPage = contentHeight >= scrollViewHeight; // 内容高度是否大于列表高度
      if (isContentFillPage && isEndReached) {
        if (!detailLoading) {
          const obj = {
            pagenum: activeTab ? withdraw.pagenum + 1 : deposit.pagenum + 1,
            pagesize: parseInt((height - 162)/66),
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
            <TabViews detailLoading1={detailLoading1} changeTab={changeTab} detailLoading={detailLoading}
                      transferArr={transferArr} refreshData={this.refreshData} activeTab={activeTab} nextPage={nextPage} goDetail={goDetail}/>
          </View>
          <View style={s.btnView}>
            <Button type="primary" style={s.btn} onPress={goReceivables} activeStyle={activeStyle}>
              <Ficon name={'shoukuan1'} color={'#358BFE'} size={16}/> <Text style={s.btnText}>收款</Text>
            </Button>
            <Text style={s.keep}>|</Text>
            <Button type="primary" style={s.btn1} onPress={goTransfer} activeStyle={activeStyle}>
              <Ficon name={'zhuanzhang'} color={'#358BFE'} size={17}/> <Text style={s.btnText}>转账</Text>
            </Button>
            <Text style={s.keep}>|</Text>
            <Button type="primary" style={s.btn1} onPress={goPoint} activeStyle={activeStyle}>
              <Ficon name={'zhuanzhang'} color={'#358BFE'} size={17}/> <Text style={s.btnText}>指向</Text>
            </Button>
          </View>
        </View>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  scene: {flex: 1,},
  container: {flex: 1, justifyContent: 'flex-start', alignItems: 'center',},
  top: {height: 80, width: '100%',backgroundColor: '#1C97E0',alignItems: 'center'},
  block: {color: '#fff',fontSize: 22,marginTop: 3},
  listItem: {width: '96%', height: 76, borderBottomWidth: 0.8, borderBottomColor: '#f3f3f3',marginLeft: '2%',
  justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'},
  listItemLeft: {flexDirection: 'row',},
  typeText: {color: '#666666', marginLeft: 12, marginTop: 2},
  fullList: { width: '100%', height: height - 162, },
  listItemRight: {justifyContent: 'flex-start', flex: 1, },
  num: {fontSize:16,color: '#666',marginBottom:14,textAlign: 'right', zIndex: 999999999,},
  date: {fontSize: 12, color: '#999',textAlign: 'right'},
  btnView: { position: 'absolute', bottom:-1, left: 0,width: '100%',justifyContent:'space-between',backgroundColor: '#F5F5F5',
    height: 50, flexDirection: 'row'},
  btn: {width: '32%', borderRadius: 0,height: 50, borderWidth: 0,backgroundColor: '#F5F5F5',},
  btn1: {width: '32%', borderRadius: 0,height: 50, borderWidth: 0,backgroundColor: '#F5F5F5',},
  nullData: {textAlign: 'center', marginTop: 20},
  btnText: {color: '#358BFE', fontSize: 16},
  keep:{ textAlign: 'center', lineHeight: 50, fontSize: 16,color: '#81aefd',}
});
export default connect(model => ({ model }))(WalletDetail)
