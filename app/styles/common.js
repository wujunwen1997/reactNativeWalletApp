import {Platform} from "react-native";

const btnDark = {
  height: 40,backgroundColor: '#FB9933',borderRadius: 22, borderColor: '#FB9933',
  marginTop: 20
}
const activeBtnDark = Object.assign({}, btnDark, {opacity: 0.9})
const btnLight = {
  height: 40,borderRadius: 22, backgroundColor: 'rgba(236,132,25,0.1)',
  borderColor: 'rgba(236,132,25,0.1)',
  marginTop: 20,
}
const activeBtnLight = Object.assign({}, btnLight, {opacity: 0.9})
const input = {
   borderColor: '#EFEFEF', borderBottomWidth: 0.8, color: '#999999',fontSize: 14,
}
const inputs  = Platform.OS === 'ios' ? Object.assign({}, input, {height: 44}) : input
const backUser = {fontSize: 16,color: '#FB9933',}
const createUser = {fontSize: 16,color: '#FFFFFF',}
const tipView = {display: 'flex', marginTop: 2,alignItems: 'flex-end'}
const toast = {color: '#358BFE', fontSize: 13}
const activeStyle={backgroundColor: '#f4f4f4'}
export {
  btnDark,
  activeBtnDark,
  activeBtnLight,
  btnLight,
  inputs,
  backUser,
  createUser,
  tipView,
  toast,
  activeStyle
}
