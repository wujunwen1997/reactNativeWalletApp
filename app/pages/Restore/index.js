/* tslint:disable:no-console */
import React from 'react';
import {Keyboard, StatusBar, StyleSheet, Text, TextInput, View, AsyncStorage} from 'react-native';
import {TextareaItem, Toast, WingBlank, Provider, Button} from '@ant-design/react-native';
import { btnDark, activeBtnDark, inputs, createUser, tipView, toast} from "../../styles/common";
import {checkPassword, checkUsername} from "../../utils";
import { connect } from 'react-redux';
import BackImage from "../../components/headerView/backImage";

class Restore extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '恢复身份',
      headerLeft: <BackImage event={() => {navigation.goBack()}}/>,
    }
  };
  state = {
    checkMnemonicWord: false,
    checkPassword: false,
    checkPasswordTwo: false,
    checkUsername: false,
    loading: false,
    disabled: false
  };
  componentDidMount () {
    this.props.dispatch({
      type: 'home/updateState',
      payload: { RestoreUserForm: {
          username: '',
          mnemonicWord: '',
          password: '',
          passwordTwo: ''
        }}
    })
  }
  render() {
    const {dispatch, model, navigation} = this.props;
    const {home} = model;
    const changeUsername = (val) => {
      if (checkUsername(val)) {
        dispatch({
          type: 'home/updateState',
          payload: { RestoreUserForm: Object.assign({}, home.RestoreUserForm, { username: val }) }
        })
      }
      this.setState({ checkUsername: !checkUsername(val) })
    };
    const changeTextArea = (val) => {
      if (val && val !== '') {
        dispatch({
          type: 'home/updateState',
          payload: {RestoreUserForm: Object.assign({}, home.RestoreUserForm, {mnemonicWord: val})}
        })
      }
      this.setState({checkMnemonicWord: !(val && val !== '')})
    };
    const changePassword = (val) => {
      if (checkPassword(val)) {
        dispatch({
          type: 'home/updateState',
          payload: {RestoreUserForm: Object.assign({}, home.RestoreUserForm, {password: val})}
        })
      }
      if (home.RestoreUserForm.passwordTwo && home.RestoreUserForm.passwordTwo !== '') {
        this.setState({checkPasswordTwo: val !== home.RestoreUserForm.passwordTwo})
      }
      this.setState({checkPassword: !checkPassword(val)})
    };
    const changePasswordTwo = (val) => {
      dispatch({
        type: 'home/updateState',
        payload: {RestoreUserForm: Object.assign({}, home.RestoreUserForm, {passwordTwo: val})}
      });
      this.setState({checkPasswordTwo: val !== home.RestoreUserForm.password})
    };
    const onRestore = () => {
      Keyboard.dismiss();
      const {mnemonicWord, password, passwordTwo, username} = home.RestoreUserForm;
      changeTextArea(mnemonicWord || '');
      changeUsername(username || '');
      changePassword(password || '');
      changePasswordTwo(passwordTwo || '');
      if (mnemonicWord && mnemonicWord !== '' && checkUsername(username) && checkPassword(password) && passwordTwo === password) {
        this.setState({loading: true, disabled: true});
        const arr = mnemonicWord.split(' ');
        let r = arr.filter(function (s) {
          return s && s.trim();
        });
        home.Wallet.recoverIdentity({username, mnemonic: r, password: password}).then(u => {
          this.setState({loading: false, disabled: false});
          if (u.identity) {
            dispatch({
              type: 'home/updateState',
              payload: {
                walletNickName: username,
                identity: u.identity,
              }
            })
            AsyncStorage.setItem('haveMnemonic', 'yes');
            Toast.success('身份恢复成功', 1, () => {
              navigation.navigate('Home')
            }, false);
          } else {
            const msg = u.errmsg ? `, ${u.errmsg}` : '';
            Toast.fail('恢复失败' + msg, 1, '', false)
          }
        })
      }
    };
    return (
      <Provider>
        <StatusBar animated={true} barStyle={'dark-content'}/>
        <WingBlank style={{height: 430}}>
            <TextareaItem rows={5} placeholder="使用助记词，用空格分隔" style={s.textarea}
                          onChange={changeTextArea}/>
            {this.state.checkMnemonicWord &&
            <View style={tipView}><Text style={toast}>助记词不能为空</Text></View>}
            <Text style={s.text}>设置身份信息</Text>
            <TextInput placeholder='身份名' textContentType='username' onChangeText={changeUsername}
                       style={inputs} selectionColor={'#9d9d9d'} />
            {this.state.checkUsername &&
            <View style={tipView}><Text style={toast}>身份名格式有误，不能为空且小于30个字符</Text></View>}
            <TextInput placeholder='钱包密码(6位数字)' textContentType='password' style={inputs} keyboardType={'numeric'}
                       onChangeText={changePassword} secureTextEntry={true} selectionColor={'#9d9d9d'}/>
            {this.state.checkPassword &&
            <View style={tipView}><Text style={toast}>密码格式有误，请输入6位数字</Text></View>}
            <TextInput placeholder='重复输入密码' textContentType='password' style={inputs} keyboardType={'numeric'}
                       onChangeText={changePasswordTwo} secureTextEntry={true} selectionColor={'#9d9d9d'}/>
            {this.state.checkPasswordTwo &&
            <View style={tipView}><Text style={toast}>两次密码不一致</Text></View>}
          <Button style={btnDark} type="primary" activeStyle={activeBtnDark}  loading={this.state.loading}
                  disabled={this.state.disabled} onPress={onRestore}>
            <Text style={createUser}>恢复身份</Text>
          </Button>
        </WingBlank>
      </Provider>
    );
  }
}
const s = StyleSheet.create({
  textarea: {paddingVertical: 5, marginTop: 24, borderWidth: 0.8,borderBottomWidth: 0,  borderColor: '#E4E6E8', color: '#999999',
  fontSize: 14},
  text: {marginTop: 32,color: '#333333', fontSize: 16, marginBottom: 5},
});
export default connect(model => ({ model }))(Restore)
