import React, {Fragment} from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {filterLastZore} from '../../utils/index';
import Ficon from '../../assets/Icomoon';
import MyTab from './myTabBar'

class Tabs extends React.Component {
  render(){
    const {transferArr, refreshData, activeTab, nextPage, goDetail, detailLoading1, changeTab, detailLoading} = this.props;
    const changeTabKey = (val) => {
      changeTab(val.i)
    };
    const FiconName = (u) => {
      if (activeTab === 0) {
        return 'jieshou'
      } else if (activeTab === 1) {
        return (u.hash || u.txHash) ? 'fasong' : 'daiqianming'
      } else if (activeTab === 2) {
        if (u.hash || u.txHash) {
          if (u.type === 'PLEDGE') {
            return 'zhixiang'
          } else if(u.type === 'WITHDRAW_PLEDGE') {
            return 'chexiaozhixiang'
          }
        } else {
          return 'daiqianming'
        }
      }
    };
    return (
      <ScrollableTabView
        page={activeTab}
        renderTabBar={() => <MyTab/>}
        onChangeTab={changeTabKey}
        tabBarUnderlineStyle={{borderBottomWidth: 0, color: '#F00', backgroundColor: '#358BFE', height: 1.5}}
        tabBarInactiveTextColor={'#333'}
        tabBarActiveTextColor={'#358BFE'} tabBarTextStyle={{fontWeight: 'normal',paddingLeft: 10, paddingRight: 10}}
      >
        {
          transferArr.map((k,i) => {
            return(
              <View tabLabel={k.til} style={[s.scene, { backgroundColor: '#fff' }]} key={i}>
                <ScrollView key={i} showsVerticalScrollIndicator={false} onScrollEndDrag={nextPage} refreshControl={
                  <RefreshControl
                    title={'正在刷新...'}
                    refreshing={detailLoading1}
                    colors={['#d1ced1',"#d1ced1"]}
                    onRefresh={() => {
                      refreshData(activeTab);
                    }}
                  />
                }>
                  {k.arr.map((u, i) => {
                    return (
                      <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => {goDetail(u, activeTab)}}>
                        <View style={s.listItem}>
                          <View style={s.listItemLeft}>
                            <Ficon name={FiconName(u) } color={'#358BFE'} size={21}/>
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
                </ScrollView>
                {
                  detailLoading && <ActivityIndicator color="#d1ced1"/>
                }
              </View>
            )
          })
        }
      </ScrollableTabView>
    );
  }
}

const s = StyleSheet.create({
  scene: {flex: 1,},
  listItem: {width: '96%', height: 76, borderBottomWidth: 0.5, borderBottomColor: '#f3f3f3',marginLeft: '2%',
    justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'},
  listItemLeft: {flexDirection: 'row',},
  typeText: {color: '#666666', marginLeft: 12, marginTop: 2},
  listItemRight: {justifyContent: 'flex-start', flex: 1, },
  num: {fontSize:16,color: '#666',marginBottom:14,textAlign: 'right', zIndex: 999999999,},
  date: {fontSize: 12, color: '#999',textAlign: 'right'},
});

export default Tabs;
