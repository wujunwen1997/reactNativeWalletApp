import axios from 'react-native-axios'
import config from './config'
import { Toast } from '@ant-design/react-native';

export default function $axios (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create(config);

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        let data
        if (response.data === undefined || response.data === null) {
          data = JSON.parse(response.request.responseText)
        } else {
          data = response.data
        }
        if (data && data.msg) {
          Toast.fail(data.msg || 'code码出现错误提示', 1, false);
        }
        return data
      },
      error => {
        if (error && error.response) {
          error.message = ''
          switch (error.response.status) {
            case 400:
              error.message = '请求错误'
              break
            case 401:
              error.message = '未授权，请登录'
              break
            case 403:
              error.message = '拒绝访问'
              break
            case 404:
              error.message = `请求地址出错: ${error.response.config.url}`
              break
            case 408:
              error.message = '请求超时'
              break
            case 500:
              error.message = '服务器内部错误'
              break
            case 501:
              error.message = '服务未实现'
              break
            case 502:
              error.message = '网关错误'
              break
            case 503:
              error.message = '服务不可用'
              break
            case 504:
              error.message = '网关超时'
              break
            case 505:
              error.message = 'HTTP版本不受支持'
              break
            default:
              error.message = '请求失败'
              break
          }
        }
        Toast.fail(error.message, 1, false);
        return Promise.reject(error) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options).then(res => {
      if (res && res.msg) {
        reject(res)
      } else {
        resolve(res && res.data)
      }
      return false
    }).catch(error => {
      reject(error)
    })
  })
}
