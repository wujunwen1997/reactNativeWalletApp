import React from 'react';
import {ActivityIndicator} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';

class AuthLoadingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  componentDidMount() {
    const {model, navigation, dispatch} = this.props;
    const {home} = model;
    const {navigate} = navigation;
    SplashScreen.hide();
    home.Wallet.is_identity_exist().then(res => {
      dispatch({
        type: 'home/updateState',
        payload: {isIdentity:!!(res.is_exist)}
      });
      navigate(res.is_exist ? 'PasswordEnter' :　'Auth');
      home.coinTypes && home.coinTypes.length === 0 && dispatch({type: 'home/getCoinTypes', payload: ''});
    });
  }
  render() {
    return (
      <ActivityIndicator color={'#F8f8f8'}/>
    );
  }
}
export default connect(model => ({ model }))(AuthLoadingScreen)
