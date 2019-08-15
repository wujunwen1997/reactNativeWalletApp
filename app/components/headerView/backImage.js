import {Image, TouchableOpacity, View} from "react-native";
import React from "react";
import Ficon from "../../assets/Icomoon";

class backImage extends React.Component{
  render() {
    const {event, color} = this.props;
    return(
      <TouchableOpacity onPress={event} activeOpacity={0.8}>
        <View style={{height: '100%', width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Ficon name={'left1-copy'} size={17} color={color || '#444444'}/>
        </View>
      </TouchableOpacity>
    )
  }
}
export default backImage
// style={{width: 28, height: 16, marginLeft: 13, borderWidth: 1}}/>
