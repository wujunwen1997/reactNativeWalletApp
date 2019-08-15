import React, {Component} from 'react'
import {StyleSheet, Image, Text, View,} from 'react-native';
import {WingBlank} from '@ant-design/react-native';
import BackImage from "../../../components/headerView/backImage";

class Introduction extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '功能介绍',
      headerLeft: <BackImage event={() => {navigation.goBack()}}/>,
    }
  };
  render() {
    return (
        <WingBlank style={s.container}>
          <View style={s.view}>
              <Text>   链付钱包是一款区块链数字钱包管理器，支持多链，如：以太坊、比特币、莱特币 等，它帮助你非常简单、安全地管理在区块链上的账户和资产</Text>
            </View>
        </WingBlank>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'flex-start',alignItems: 'center'},
  view: {marginTop: 24}
});
export default Introduction
