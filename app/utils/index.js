import { Toast } from '@ant-design/react-native';
import {Platform, PermissionsAndroid} from "react-native";
import CameraRoll from '@react-native-community/cameraroll'
import RNFS from "react-native-fs";
import RNFetchBlob from "rn-fetch-blob";
const checkUsername = (val) => {
  if (val && val !== '') {
    return val.length < 30
  } else {
    return false
  }
};
const checkPassword = (value) => {
  const reg = /^\d{6}$/;
  return reg.test(value)
};
async function requestReadPermission() {
  try {
    //返回string类型
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': '读写权限',
        'message': '我们尊重您的个人权限，部分功能的正常使用需要您开启此权限'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Toast.success("你已获取了读写权限", 2)
    } else {
      Toast.fail("获取读写权限失败", 2)
    }
  } catch (err) {
    Toast.fail(err.toString(), 2)
  }
}
const saveBase64Img = (base64Img) => {
  if (Platform.OS === 'ios') {
    CameraRoll.saveToCameraRoll(base64Img)
      .then((res) => {
        Toast.success('保存成功', res);
      }).catch(() => {
      Toast.fail('保存失败', 2);
    });
  } else {
    const dirs = RNFS.ExternalDirectoryPath;
    const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.png`;
    const imageDatas = base64Img.split('data:image/png;base64,');
    const imageData = imageDatas[1];

    RNFetchBlob.fs.writeFile(downloadDest, imageData, 'base64').then((rst) => {
      try {
        CameraRoll.saveToCameraRoll(downloadDest).then((e1) => {
          Toast.success('保存成功,请查看相册-最新', 2)
        }).catch((e2) => {
          requestReadPermission()
        })
      } catch (e3) {
        // Alert.alert(JSON.stringify(e3))
        console.log('catch',e3);
        Toast.fail('保存失败', 2)
      }
    });
  }
};
function randomsort(a, b) {
  return Math.random()>.5 ? -1 : 1;
  //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
}
function remove(val, arr) {
  let index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr
}
function filterLastZore (cellValue) {
  const regexp = /(?:\.0*|(\.\d+?)0+)$/;
  return cellValue.toString().replace(regexp, '$1')
}
function myTime(date){
  var arr=date.split("T");
  var d=arr[0];
  var darr = d.split('-');

  var t=arr[1];
  var tarr = t.split('.000');
  var marr = tarr[0].split(':');

  var dd = parseInt(darr[0])+"-"+parseInt(darr[1])+"-"+parseInt(darr[2])+" "+parseInt(marr[0])+":"+parseInt(marr[1])+":"+parseInt(marr[2]);
  return dd;
}
export {
  filterLastZore,
  checkUsername,
  checkPassword,
  saveBase64Img,
  requestReadPermission,
  randomsort,
  remove,
  myTime
}
