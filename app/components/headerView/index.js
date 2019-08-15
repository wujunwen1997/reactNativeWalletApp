import {Icon} from "@ant-design/react-native";
import Ficon from '../../assets/Icomoon';
import {Platform, Text, TouchableOpacity, View} from "react-native";
import React from "react";
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56;

class headerview extends React.Component{
  render() {
    const { color, icon, size, event} = this.props;
    return(
      <TouchableOpacity activeOpacity={0.8} onPress={event}>
        <View style={{width: TITLE_OFFSET, flex:1, alignItems: 'center', height: '100%', justifyContent: 'center'}}>
          <Ficon name={icon} size={size || 30} style={{color: color}} />
        </View>
      </TouchableOpacity>
    )
  }
}
export default headerview
