import React, {Component} from 'react'
import {BoxShadow} from 'react-native-shadow';
import {Platform, View} from "react-native";
const IS_ANDROID = Platform.OS === 'ios'

class shadow extends Component {
  render() {
    const {width, height, children} = this.props;
    return !IS_ANDROID ? (
      <BoxShadow
        setting={{
          width,
          height,
          color:'#C4C4C5',
          border: 5,
          radius:3,
          opacity:0.21,
          x:0,
          y:0,
          style:{marginVertical:6}
        }}>
        {children}
      </BoxShadow>
    ) : (
      <View
        style={{
          backgroundColor: 'white',
          shadowColor: '#000000',
          shadowOffset: {h: 5, w: 3},
          shadowRadius: 10,
          shadowOpacity: 0.5,
        }}>
        {children}
      </View>)
  }
}
export default shadow
