import React, { Component } from 'react'
import {StyleSheet, Image, Text, View, ImageBackground, Dimensions,} from 'react-native';
import { Button } from '@ant-design/react-native';
import { btnDark, btnLight, activeBtnDark, activeBtnLight, backUser, createUser } from "../../styles/common";
import { connect } from 'react-redux';
import BoxShadow from "../../components/BoxShadow";

const height = Dimensions.get('window').height;

class Register extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    const { navigation } = this.props;
    const goEstablish = () => {
      navigation.navigate('Establish')
    }
    const goRestore = () => {
      navigation.navigate('Restore')
    }
    return (
      <View style={s.container}>
        <ImageBackground source={require('../../assets/images/r1.png')} style={s.headerImg}>
          <View style={{marginTop: height * 0.17}}>
          <BoxShadow height={350} width={340}>
            <View style={s.content}>
              <Image source={require('../../assets/images/r3.png')} style={s.image}/>
              <Text style={s.text}>创建你的第一个数字身份</Text>
              <Button type="primary" style={Object.assign({ width: 270 }, btnDark)}
                      onPress={goEstablish} activeStyle={activeBtnDark}>
                <Text style={createUser}>创建身份</Text>
              </Button>
              <Button type="primary" style={Object.assign({ width: 270 }, btnLight)}
                      activeStyle={activeBtnLight} onPress={goRestore}>
                <Text style={backUser}>恢复身份</Text>
              </Button>
            </View>
          </BoxShadow>
          </View>
        </ImageBackground>
      </View>
    )
  }
}
const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', },
  headerImg: { height: '100%', width: '100%', alignItems: 'center' },
  content: {width: 340, height: 350, display: 'flex', alignItems: 'center', backgroundColor: '#fff',
  borderRadius: 5},
  image: { marginTop: 42, marginBottom: 36, width: 62, height: 62, },
  text: { fontSize: 17, color: '#999' },
});
export default connect(model => ({ model }))(Register)
