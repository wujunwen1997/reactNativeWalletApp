import getRequest from '../config/getNotiData'
//  操作列表
export function login (data) {
  return getRequest('/login', data, 'POST')
}
export function register (data) {
  return getRequest('/register', data, 'POST')
}
export function getBlockchains () {
  return getRequest('/wallet/blockchains')
}
