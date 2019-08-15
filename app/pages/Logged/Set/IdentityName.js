import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Keyboard,} from 'react-native';
import {Button, Provider, Toast, WingBlank,} from '@ant-design/react-native';
import BackImage from "../../../components/headerView/backImage";
import {activeBtnDark, btnDark, createUser} from "../../../styles/common";
import { connect } from 'react-redux';

class IdentityName extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '修改身份名',
      headerLeft: <BackImage event={() => {navigation.goBack()}}/>,
    }
  };
  state = {
    disabled: false, loading: false
  };
  componentDidMount() {
    const {dispatch, model} = this.props;
    const {walletNickName} = model.home;
    dispatch({
      type: 'home/updateState',
      payload: {
        setNickName: walletNickName
      }
    })
  }
  render() {
    const {dispatch, model, navigation} = this.props;
    const {Wallet, walletNickName, setNickName} = model.home;
    const onChangeText = (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          setNickName: val
        }
      })
    };
    const goOn = () => {
      Keyboard.dismiss();
      if (setNickName === '') {
        Toast.fail('请输入身份名', 2);
      }
      this.setState({loading: true, disabled: true});
      Wallet.rename_identity(setNickName).then(res => {
        this.setState({loading: false, disabled: false});
        if (!res.success) {
          const msg = res.errmsg ? `, ${res.errmsg}` : '';
          Toast.fail('修改失败' + msg, 2)
        } else {
          Toast.success('修改成功', 2);
          dispatch({
            type: 'home/updateState',
            payload: {
              walletNickName: setNickName
            }
          })
        }
      })
    };
    return (
      <Provider>
        <View style={s.container}>
          <TextInput
            style={s.input} value={setNickName} autoFocus={true}
            selectionColor={'#9d9d9d'}
            placeholder="身份名"
            onChangeText={onChangeText}
          />
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20}>
            <WingBlank style={s.btn}>
              <Button style={Object.assign({}, btnDark)} type="primary" onPress={goOn} loading={this.state.loading}
                      disabled={this.state.disabled} activeStyle={activeBtnDark}>
                <Text style={createUser}>完成</Text>
              </Button>
            </WingBlank>
          </KeyboardAvoidingView>
        </View>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between', },
  input: {height: 54, backgroundColor: '#FFF', fontSize: 14, paddingLeft: 20,borderBottomWidth: 0.7,
  borderBottomColor: '#f7f7f7', width: '100%'},
  btn: {marginBottom: 64,}
});
export default connect(model => ({ model }))(IdentityName)
