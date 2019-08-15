import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import { Button, Provider, Modal, WingBlank } from '@ant-design/react-native';
import BackImage from "../../components/headerView/backImage";
import {activeBtnDark, createUser, btnDark} from "../../styles/common";
import { connect } from 'react-redux';

class BackupPrompt extends Component {
  state = {
    text: [
      {
        title: '备份提示',
        bu: ['使用纸和笔正确抄写助记词', '如果你的手机丢失、被盗、损坏', '助记词可以恢复你的资产']
      },{
        title: '离线保管',
        bu: ['妥善保管至隔离网络的安全地方', '请勿将助记词在联网环境下分享和存储']
      }
    ],
  };
  static navigationOptions = ({navigation}) => {
    return {
      title: '备份提示',
      headerLeft: <BackImage event={() => {
        navigation.navigate(navigation.getParam('haveMnemonic') ? 'SetIndex' : navigation.getParam('isIdentity') ? 'PasswordEnter' : 'Register')
      }}/>,
    }
  };
  componentDidMount() {
    this.props.navigation.setParams({ isIdentity: this.props.model.home.isIdentity, haveMnemonic: this.props.model.home.haveMnemonic});
  }
  render() {
    const next = () => {
      Modal.alert('请勿截屏', '请勿截屏分享和储存，这可能被第三方恶意软件收集，造成财产损失', [
        {
          text: '取消',
          style: 'cancel',
        },
        { text: '确定', onPress: () => { this.props.navigation.navigate('BackupMnemonics')}},
      ]);
    };
    return (
      <Provider>
        <StatusBar animated={true} barStyle={'dark-content'}/>
        <WingBlank style={s.container}>
          <View style={s.top}>
            {
              this.state.text.map((k, i) => {
                return(
                  <Fragment key={i}>
                    <View style={s.title}>
                      <View style={s.spot}/><Text style={s.backup}>{k.title}</Text>
                    </View>
                    <View style={s.textView}>
                      {k.bu.map((u, j) => {
                        return(
                          <Text style={s.text} key={j}>{u}</Text>
                        )
                      })}
                    </View>
                  </Fragment>
                )
              })
            }
          </View>
          <View style={s.bottom}>
            <Button style={btnDark} type="primary" onPress={next}
                    activeStyle={activeBtnDark}>
              <Text style={createUser}>下一步</Text>
            </Button>
          </View>
        </WingBlank>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between',},
  top: {width: '100%', paddingTop: 32, paddingLeft: 18, paddingRight: 18},
  backup: {fontSize: 16, color: '#333'},
  title: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  spot: {height: 5, width: 5,borderRadius: 5, backgroundColor: '#333', marginRight: 8},
  textView: {paddingLeft: 13, marginBottom: 22},
  text: {lineHeight: 24},
  bottom: {marginBottom: 64}
});
export default connect(model => ({ model }))(BackupPrompt)
