import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, AsyncStorage} from 'react-native';
import { Button, Provider, Icon, Toast } from '@ant-design/react-native';
import {activeBtnDark, createUser, btnDark} from "../../styles/common";
import {randomsort, remove} from '../../utils/index.js'
import { connect } from 'react-redux';
import BackImage from "../../components/headerView/backImage";

class BackupMnemonics extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    let dispatch = navigation.getParam('dispatch');
    return {
      title: '备份助记词',
      headerLeft: <BackImage event={() => {
        if (params.home) {
          if (params.copyM.length > 0) {
            dispatch({
              type: 'home/updateState',
              payload: {
                mnemonics: params.home.mnemonic.split(" "),
                mnemonic:params.home.mnemonic,
                copyM: [],
                NextText: '下一步'
              }
            });
            navigation.setParams({ home: params.home, dispatch: navigation.getParam('dispatch'), copyM: [] });
          } else {
            navigation.navigate('BackupPrompt')
          }
        }
      }}/>,
    }
  };
  componentDidMount() {
    this.props.navigation.setParams({ home: this.props.model.home, dispatch: this.props.dispatch, copyM: [] });
  }
  render() {
    const {dispatch, model, navigation} = this.props;
    const {home} = model;
    const { copyM, mnemonics, mnemonic, NextText, haveMnemonic } = home;
    const next = () => {
      if (NextText !== '下一步') {
        if (mnemonics.length === mnemonic.split(" ").length) {
          //  检查助记词的顺序是否正确
          if (mnemonics.join(' ') === mnemonic) {
            AsyncStorage.setItem('haveMnemonic', 'yes');
            navigation.navigate(haveMnemonic ? 'SetIndex' : 'AuthLoading');
            dispatch({
              type: 'home/updateState',
              payload: {
                mnemonics: mnemonic.split(" "),
                mnemonic:mnemonic,
                copyM: [],
                NextText: '下一步',
                haveMnemonic: false
              }
            })
          } else {
            Toast.fail('助记词顺序错误', 2);
          }
        }else {
          Toast.info('请选填完整的助记词再执行完成步骤', 2);
        }
      } else {
        dispatch({
          type: 'home/updateState',
          payload: {mnemonics: [], copyM: mnemonics.sort(randomsort), NextText: '完成'}
        });
        this.props.navigation.setParams({ home: this.props.model.home,
          dispatch: this.props.dispatch,
          copyM: mnemonics.sort(randomsort) });
      }
    };
    const next1 = () => {
      AsyncStorage.setItem('haveMnemonic', 'yes');
      navigation.navigate(haveMnemonic ? 'SetIndex' : 'AuthLoading');
    };
    const getText = (val) => {
      let obj = mnemonics;
      if (mnemonics.includes(val)) {
        obj = remove(val, mnemonics)
      } else {
        obj = mnemonics.concat([val])
      }
      dispatch({
        type: 'home/updateState',
        payload: {
          mnemonics: obj
        }
      })
    };
    return (
      <Provider>
        <View style={s.container}>
          <View style={s.top}>
            <Icon name={'form'} color={'#358BFE'} size={36} style={s.icon}/>
            <Text>请正确抄写并安全备份助记词</Text>
            <View style={s.textView}>
              <Text style={s.text}>{mnemonics.join('  ')}</Text>
            </View>
            <View style={s.keyWord}>
              {
                copyM.map((u, i) => {
                  return(
                    <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => {getText(u)}}>
                      <View style={mnemonics.includes(u) ? s.blockSelect : s.block}>
                        <Text>{u}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          </View>
          <View style={s.bottom}>
            <Button style={btnDark} type="primary" onPress={next1}
              activeStyle={activeBtnDark}>
               <Text style={createUser}>{NextText}</Text>
            </Button>
            <Button style={btnDark} type="primary" onPress={next}
                    activeStyle={activeBtnDark}>
              <Text style={createUser}>{NextText}</Text>
            </Button>
          </View>
        </View>
      </Provider>
    )
  }
}
const common = {height: 29,borderWidth:0.8, borderRadius: 3, width: 'auto', alignItems:'center',
  justifyContent: 'center', paddingLeft: 4, paddingRight: 4,  marginRight: 8, marginBottom: 11}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between',alignItems: 'center'},
  icon: {marginTop: 32, marginBottom:19},
  top: {alignItems: 'center', width: '100%'},
  textView: {width: '100%', backgroundColor: '#F6F6F6', paddingTop: 24, paddingLeft: 12,paddingBottom: 24,
  paddingRight: 12, marginTop: 26, minHeight: 88},
  text: {color: '#333', fontSize: 16},
  bottom: {marginBottom: 64, width: '90%'},
  keyWord: {width: '100%',flexDirection: 'row',paddingLeft: 25, paddingRight: 17,
  flexWrap: 'wrap', marginTop: 20},
  block: Object.assign({}, common, {borderColor: '#358BFE'}),
  blockSelect: Object.assign({}, common, {borderColor: '#aba6b4', backgroundColor: '#f8f8f8'}),
});
export default connect(model => ({ model }))(BackupMnemonics)
