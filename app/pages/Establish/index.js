import React, { Component } from 'react'
import {StyleSheet, Text, TextInput, View, StatusBar, ScrollView, Keyboard} from 'react-native';
import {Button, Toast, WingBlank, Provider} from '@ant-design/react-native';
import { btnDark, inputs, activeBtnDark, createUser, tipView, toast } from "../../styles/common";
import { checkUsername, checkPassword } from '../../utils/index'
import { connect } from 'react-redux';
import BackImage from "../../components/headerView/backImage";

class Establish extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '创建身份',
      headerLeft: <BackImage event={() => {navigation.goBack()}}/>,
    }
  };
  state = {
    checkUsername: false,
    checkPassword: false,
    checkPasswordTwo: false,
    loading: false,
    disabled: false
  };
  componentDidMount () {
    this.props.dispatch({
      type: 'home/updateState',
      payload: { createUserForm: {
          username: '',
          password: '',
          passwordTwo: ''
        }}
    })
  }
  render() {
    const { dispatch, model } = this.props;
    const { home } = model;
    const changeUsername = (val) => {
      if (checkUsername(val)) {
        dispatch({
          type: 'home/updateState',
          payload: { createUserForm: Object.assign({}, home.createUserForm, { username: val }) }
        })
      }
      this.setState({ checkUsername: !checkUsername(val) })
    };
    const changePassword = (val) => {
      if (checkPassword(val)) {
        dispatch({
          type: 'home/updateState',
          payload: { createUserForm: Object.assign({}, home.createUserForm, { password: val }) }
        })
      }
      if (home.createUserForm.passwordTwo && home.createUserForm.passwordTwo !== '') {
        this.setState({ checkPasswordTwo: val !== home.createUserForm.passwordTwo })
      }
      this.setState({ checkPassword: !checkPassword(val) })

    };
    const changePasswordTwo = (val) => {
      dispatch({
        type: 'home/updateState',
        payload: { createUserForm: Object.assign({}, home.createUserForm, { passwordTwo: val }) }
      });
      this.setState({ checkPasswordTwo: val !== home.createUserForm.password })
    };
    const onCreate = () => {
      Keyboard.dismiss();
      const { username, password, passwordTwo } = home.createUserForm;
      changeUsername(username || '');
      changePassword(password || '');
      changePasswordTwo(passwordTwo || '');
      if (checkUsername(username) && checkPassword(password) && passwordTwo === password) {
        this.setState({loading: true, disabled: true})
        home.Wallet.createIdentity({ username, password }).then(res => {
          this.setState({loading: false, disabled: false});
          if (!res.success) {
            const msg = res.errmsg ? `, ${res.errmsg}` : '';
            Toast.fail('创建失败' + msg, 2)
          } else {
            Toast.success('创建成功! 正在跳转,请稍等...', 2);
            dispatch({
              type: 'home/updateState',
              payload: {
                mnemonics: res.mnemonic.split(" "),
                mnemonic:res.mnemonic,
                copyM: []
              }
            });
            this.props.navigation.navigate('BackupPrompt')
          }
        })
      }
    };
    return (
      <Provider>
      <ScrollView
        style={s.container}
        keyboardShouldPersistTaps={'always'}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar animated={true} barStyle={'dark-content'}/>
        <WingBlank>
          <TextInput placeholder='身份名' autoFocus={true} textContentType='username' onChangeText={changeUsername}
            style={Object.assign({}, inputs)} selectionColor={'#9d9d9d'} />
          {this.state.checkUsername &&
            <View style={tipView}><Text style={toast}>身份名格式有误，不能为空且小于30个字符</Text></View>}
          <TextInput placeholder='密码(6位数字)' textContentType='password' style={inputs}
            onChangeText={changePassword} selectionColor={'#9d9d9d'} secureTextEntry={true}/>
          {this.state.checkPassword &&
            <View style={tipView}><Text style={toast}>密码格式有误，请输入6位数字</Text></View>}
          <TextInput placeholder='重复输入密码' textContentType='password'
            style={inputs} selectionColor={'#9d9d9d'} secureTextEntry={true}
            onChangeText={changePasswordTwo} />
          {this.state.checkPasswordTwo &&
            <View style={tipView}><Text style={toast}>两次密码不一致</Text></View>}
          <Button style={btnDark} type="primary" loading={this.state.loading} disabled={this.state.disabled}
            activeStyle={activeBtnDark} onPress={onCreate}>
            <Text style={createUser}>创建身份</Text>
          </Button>
        </WingBlank>
      </ScrollView>
      </Provider>
    )
  }
}
const s = StyleSheet.create({
  container: { flex: 1 },
  btn: { marginTop: 20, },
});
export default connect(model => ({ model }))(Establish)
