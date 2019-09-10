import React, {Component} from 'react'
import Svg from '../../../../components/Svg';
import BoxShadow from "../../../../components/BoxShadow";
import { connect } from 'react-redux';
import {
  StyleSheet, Text, View, StatusBar,ActivityIndicator,Platform, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import BackImage from "../../../../components/headerView/backImage";
import HeaderView from "../../../../components/headerView";

const width = Dimensions.get('window').width;
class ChoiceCurrency extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '选择区块链',
      headerLeft: <BackImage color={'#fff'} event={() => {navigation.goBack()}}/>,
    }
  };
  state = {
    coins: []
  }
  componentDidMount () {
    if (this.props.navigation.getParam('routeName') === 'MultiSignature') {
      this.setState({coins: this.props.model.home.coinTypes.filter(u => u.symbol !== 'ETH')})
    } else {
      this.setState({coins: this.props.model.home.coinTypes})
    }
    this.props.dispatch({type: 'home/getCoinTypes', payload: ''})
  }
  render() {
    const {navigation, model} = this.props;
    const {home} = model;
    const walletType = (_) => {
      return(
        <View style={s.content}>
                      <Svg icon={_.symbol} style={s.icon} width={30} height={30}/>
                      <Text style={s.text}>{_.name} ({_.symbol})</Text>
                    </View>
      )
    }
    const shadowWalletType = (_) => {
      return(
        <BoxShadow width={width-24} height={64}>
                   {walletType(_)}
        </BoxShadow>
      )
    }
    return (
      <View style={s.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.container1}>
          {
            this.state.coins.map((_, i) => {
              return(
                <TouchableOpacity key={i} onPress={() => {this.props.navigation.navigate(navigation.getParam('routeName'), {type: _.type})}}
                                  activeOpacity={0.8} style={Platform.OS === 'ios' && { width: '90%'}}>
                 { Platform.OS === 'ios' ? walletType(_) : shadowWalletType(_)}
                </TouchableOpacity>
              )
            })
          }
          </View>
        </ScrollView>
      </View>
    )
  }
}
const android =  {height: 64, backgroundColor: '#FFF', borderRadius: 3,
  flexDirection: 'row', alignItems: 'center',shadowColor: '#333', shadowOpacity: 0.2,
  shadowRadius: 2, shadowOffset:{width: 0, height: 0}}

const s = StyleSheet.create({
  container: { flex: 1, paddingTop: 24,},
  container1: {height: 'auto', width: '100%', alignItems: 'center'},
  content: Platform.OS === 'ios' ? Object.assign({}, android, {marginTop:20,}) : android,
  text: {color: '#333333', fontSize: 15, marginLeft: 16},
  icon: {marginLeft: 32,}
});
export default connect(model => ({ model }))(ChoiceCurrency)
