export default {
  // 基础url前缀
  baseURL: 'http://192.168.0.57:8081/api',
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json, text/plain'
  },
  // 设置超时时间
  timeout: 10000,
  // 携带凭证,跨域携帶cookie
  withCredentials: true,
  // 返回数据类型
  responseType: 'json',
  dataType: 'json'
}
