import React, {Component} from 'react'
import {
  StyleSheet, Image, Text, View, TouchableOpacity,
} from 'react-native';
import {WingBlank, Provider, Toast} from '@ant-design/react-native';
import BackImage from "../../../components/headerView/backImage";
import Ficon from "../../../assets/Icomoon";

class SetIndex extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: null,
      headerLeft: <BackImage event={() => {navigation.goBack()}}/>,
    }
  };
  render() {
    const onUp = () => {
      Toast.info('已是最新版本')
    }
    const onIntroduction = () => {
      this.props.navigation.navigate('Introduction')
    }
    return (
      <Provider>
        <WingBlank style={s.container}>
          <Image style={s.image} source={require('../../../assets/images/r3.png')}/>
          <Text style={s.name}>链付钱包</Text>
          <Text style={s.version}>Version1.0</Text>
          <View style={s.viewTop}>
            <TouchableOpacity activeOpacity={0.8} onPress={onIntroduction}>
              <View style={s.view1}>
                <Text>功能介绍</Text>
                <Ficon name={'left1'} size={16} style={{color: '#c4c4c4'}}/>
              </View>
            </TouchableOpacity>
          </View>
          <View style={s.view}>
            <TouchableOpacity activeOpacity={0.8} onPress={onUp}>
              <View style={s.view1}>
                  <Text>检查新版本</Text>
                  <Ficon name={'left1'} size={16} style={{color: '#c4c4c4'}}/>
              </View>
            </TouchableOpacity>
          </View>
        </WingBlank>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'flex-start',alignItems: 'center'},
  image: {width: 62, height: 62, marginTop: 50},
  name: {color: '#333', fontSize: 22,marginTop: 24},
  version: {color: '#333', fontSize: 18, marginTop: 4},
  viewTop: {borderTopWidth: 0.8,width: '100%', height: 56, borderBottomWidth: 0.8, borderColor: '#EFEFEF', marginTop: 24},
  view: { width: '100%', height: 56, borderBottomWidth: 0.8,  borderColor: '#EFEFEF'},
  view1: {
    flexDirection: 'row', width: '100%', height: 56,
    justifyContent: 'space-between', alignItems: 'center',
  }
});
export default SetIndex
