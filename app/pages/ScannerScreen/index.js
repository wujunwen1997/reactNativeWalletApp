import React from 'react';
import {
  View, Text, StyleSheet, Image, Alert, Dimensions, Platform, StatusBar
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Icon, Provider, Toast} from "@ant-design/react-native";
import { connect } from 'react-redux';
import {readerQR} from 'react-native-lewin-qrcode-chainspayfork'
//图片选择器
import ImagePicker from 'react-native-image-picker';

//图片选择器参数设置
const options = {
  title: '请选择图片来源',
  cancelButtonTitle:'取消',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
class ScannerScreen extends React.Component {

  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      handle: '',
      avatarSource: null
    };
  }
  render() {
    let scanView = null;
    if (Platform.OS === 'ios') {
      scanView = (
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          flashMode={RNCamera.Constants.FlashMode.auto}
          onBarCodeRead={(e) => barcodeReceived(e)}
          captureAudio={false}
        >
          <View style = {{height: (height-264)/3, width:width, backgroundColor:'rgba(0,0,0,0.5)',}}>
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={styles.itemStyle}/>
            <View style={styles.rectangle}>
              <Image
                style={[styles.rectangle, {position:'absolute', left: 0, top: 0}]}
                source={require('../../assets/images/r5.png')}
              />
            </View>
            <View style={styles.itemStyle}/>
          </View>
          <View style={{flex:1,backgroundColor:'rgba(0, 0, 0, 0.5)',width:width,alignItems:'center'}}>
            <Text style={styles.textStyle}>将二维码放入框内，即可自动扫描</Text>
          </View>
        </RNCamera>
      )
    } else {
      scanView = (
        <RNCamera
          style={styles.preview}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE}
          flashMode={RNCamera.Constants.FlashMode.auto}
          onBarCodeRead={(e) => barcodeReceived(e)}
        >
          <View style = {{height: (height-244)/3, width:width, backgroundColor:'rgba(0,0,0,0.5)',}}>
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={styles.itemStyle}/>
            <View style={styles.rectangle}>
              <Image
                style={[styles.rectangle, {position:'absolute', left: 0, top: 0}]}
                source={require('../../assets/images/r5.png')}
              />
            </View>
            <View style={styles.itemStyle}/>
          </View>
          <View style={{flex:1,backgroundColor:'rgba(0, 0, 0, 0.5)',width:width,alignItems:'center'}}>
            <Text style={styles.textStyle}>将二维码放入框内，即可自动扫描</Text>
          </View>
        </RNCamera>
      )
    }
    const goBack = () => {
      this.props.navigation.goBack()
    }
    const choosePic = () => {
      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.error) {
          Toast.info("ImagePicker发生错误：" + response.error, 1, '', false);
          return;
        }
        readerQR(response.path).then((data)=>{
          onGo(data)
        })
      });
    }
    const barcodeReceived = (e) => {
      if (e) {
        onGo(e.data)
      } else {
        Alert.alert(
          '提示',
          '扫描失败，请将手机对准二维码重新尝试',
          {cancelable: false}
        )
      }
    }
    const onGo = (result) => {
      const {navigation, dispatch} = this.props;
      const Arr = navigation.getParam('key');
      let obj = {};
      if (Array.isArray(Arr)) {
        let obj1 = {};
        obj1[Arr[1]] =  result;
        obj[Arr[0]]= obj1
      } else {
        obj[Arr] = result
      }
      dispatch({
        type: 'home/updateState',
        payload: obj
      });
      navigation.navigate(navigation.getParam('back'));
    }
    return (
      <Provider>
      <View style={styles.container}>
        <StatusBar translucent={true} animated={true}/>
        <View style={styles.header}>
          <Icon name={'left'} size={24} style={{color: '#fbfbfb'}} onPress={goBack}/>
          <Text style={styles.text} onPress={choosePic}>本地</Text>
        </View>
        {scanView}
      </View>
      </Provider>
    );
  }
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {position: 'absolute', top: 0, left: 0,zIndex: 999,  width: width,
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    height: Platform.OS === 'ios' ? 100 : 80 + StatusBar.currentHeight,flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',paddingLeft: 20,paddingRight: 20},
  preview: {
    flex: 1,
  },
  text: {color: '#fbfbfb', fontSize: 18},
  itemStyle:{
    backgroundColor:'rgba(0,0,0,0.5)',
    width:(width-200)/2,
    height:200
  },
  textStyle:{
    color:'#fff',
    marginTop:20,
    fontWeight:'bold',
    fontSize:18
  },
  animatedStyle:{
    height:2,
    backgroundColor:'#1C97E0'
  },
  rectangle: {
    height: 200,
    width: 200,
  }
});
export default connect(model => ({ model }))(ScannerScreen)
