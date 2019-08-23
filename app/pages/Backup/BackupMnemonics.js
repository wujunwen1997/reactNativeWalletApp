import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native';
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
        dispatch({
          type: 'home/updateState',
          payload: {mnemonics: mnemonics.map(x => ''), copyM: mnemonics.sort(randomsort), NextText: '完成'}
        });
        this.props.navigation.setParams({ home: this.props.model.home,
          dispatch: this.props.dispatch,
          copyM: mnemonics.sort(randomsort) });
    };
    const next1 = () => {
      AsyncStorage.setItem('haveMnemonic', 'yes');
      navigation.navigate(haveMnemonic ? 'SetIndex' : 'AuthLoading');
    };
    const onMnemomics = () => {
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
    }
    const getText = (val) => {
      console.log(val, mnemonics)
      let obj = mnemonics;
      if (mnemonics.includes(val)) {
        for(let i = 0; i < mnemonics.length; i++) {
          if (mnemonics[i] === val) {
            obj[i] = ''
          }
        }
      } else {
        for(let i = 0; i < mnemonics.length; i++) {
          if (mnemonics[i] === '') {
            obj[i] = val;
            break
          }
        }
      }
      obj.filter( u => u === '').length === 0 && onMnemomics();
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
            <Text style={s.textTip}>请正确抄写并安全备份助记词</Text>
              <View style={s.textView}>
                {
                  mnemonics.map((u, index) => {
                    return(
                      <Text key={index} style={ u === '' ? s.nullText : s.mnText}>{u}</Text>
                    )
                  })
                }
              </View>
          </View>
          {
            NextText === '下一步' ?  <View style={s.bottom}>
                <Button style={btnDark} type="primary" onPress={next}
                        activeStyle={activeBtnDark}>
                  <Text style={createUser}>{NextText}</Text>
                </Button>
              </View> : <View style={s.keyWord}>
              {
                copyM.map((u, i) => {
                  return(
                    <Text key={i} onPress={() => {getText(u)}} style={mnemonics.includes(u) ? s.blockSelect : s.block}>{u}</Text>
                  )
                })
              }
            </View>
          }
        </View>
      </Provider>
    )
  }
}
const common = {width: '28%',height: 36, backgroundColor: '#fff', marginBottom: 13, borderRadius: 16,color: '#1C97E0',
  textAlign: 'center',lineHeight: 36}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between',alignItems: 'center',},
  textTip: {fontSize: 16, marginBottom: 10},
  mnText:{width: '30%',height: 40, backgroundColor: '#1C97E0', marginBottom: 10, borderRadius: 20,color: '#fff',
  textAlign: 'center',lineHeight: 40},
  nullText: {width: '30%',height: 40, backgroundColor: '#EFEFEF', marginBottom: 10, borderRadius: 20,color: '#fff',
    textAlign: 'center',lineHeight: 40},
  top: {alignItems: 'center', width: '100%', marginTop: 20},
  textView: {width: '96%', marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around',},
  text: {color: '#333', fontSize: 16},
  bottom: {marginBottom: 64, width: '90%'},
  keyWord: {width: '100%', marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around',
    backgroundColor: '#EFEFEF', paddingTop: 12, },
  block: Object.assign(common),
  blockSelect: Object.assign({}, common, {color: '#A8A8A8'}),
});
export default connect(model => ({ model }))(BackupMnemonics)
