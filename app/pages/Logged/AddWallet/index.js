import React, {Component} from 'react'
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Dimensions} from 'react-native';
import { Button, Provider, Icon, Toast, List, WingBlank, WhiteSpace } from '@ant-design/react-native';
import BoxShadow from "../../../components/BoxShadow";
import Ficon from '../../../assets/Icomoon';
import BackImage from "../../../components/headerView/backImage";
const width = Dimensions.get('window').width;
class AddWallet extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '添加 ',
      headerLeft: <BackImage color={'#fff'} event={() => {navigation.goBack()}}/>,
    }
  };
  state = {
    config: [
      {icon: 'qianbaoming', text: '普通钱包', label: '快速简单设置', route: 'WalletConfig', next: 'ChoiceCurrency'},
      {icon: 'bianji', text: '多重签名', label: '需要多种设备', route: 'MultiSignature', next: 'ChoiceCurrency'},
      {icon: 'fenxiang1', text: '链接共享钱包', label: '需要邀请加入', route: 'JoinShare', next: 'JoinShare'}
    ]
  };
  render() {
    return (
      <View style={s.container}>
        {
          this.state.config.map((_, i) => {
            return(
                <TouchableOpacity key={i}
                                  onPress={() => {this.props.navigation.navigate(_.next, {routeName: _.route})}} activeOpacity={0.8}>
                  <BoxShadow height={84} width={width -24}>
                  <View style={s.content}>
                    <Ficon name={_.icon} size={18} style={s.icon}/>
                    <View style={s.textView}>
                      <Text style={s.text}>{_.text}</Text>
                      <WhiteSpace size={'sm'}/>
                      <Text style={s.label}>{_.label}</Text>
                    </View>
                  </View>
                  </BoxShadow>
                </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }
}
const s = StyleSheet.create({
  container: {flex: 1, paddingLeft: 12, paddingRight: 12, backgroundColor: '#F6F6F6',
  paddingTop: 24},
  content: {height: 84, backgroundColor: '#FFF', borderRadius: 3,
    flexDirection: 'row', alignItems: 'center',},
  icon: {backgroundColor: '#358BFE', borderRadius: 32, padding: 8, marginLeft: 32, color:'#FFFFFF'},
  textView: {marginLeft:18},
  text: {color: '#333333', fontSize: 15, lineHeight: 22},
  label: {color: '#999999', fontSize: 13, lineHeight: 20}
});
export default AddWallet
