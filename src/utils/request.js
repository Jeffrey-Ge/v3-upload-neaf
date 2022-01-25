import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './auth'

const service = axios.create({
  // baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    // 如果有token 就携带tokon
    if (token) {
      config.headers['Authorization'] = 'Bearer__' + token
    }
    if (config.method === 'get') {
      config.url.indexOf('?') === -1 ? config.url = config.url + '?_=' + (new Date().getTime()) : config.url = config.url + '&_=' + (new Date().getTime())
    }
    // 加上取消请求
    config.cancelToken = new axios.CancelToken((cancel) => {
      if (Array.isArray(window.axiosCancelTokenList)) {
        window.axiosCancelTokenList.push(cancel)
      } else {
        window.axiosCancelTokenList = [cancel]
      }
    })
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status) {
      const { status } = error.response
      let message = ''
      switch (status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '请求错误'
          break
        case 404:
          message = '请求地址出错'
          break
        case 408:
          message = '请求超时'
          break
        case 500:
          message = '服务器内部错误!'
          break
        case 501:
          message = '服务未实现!'
          break
        case 502:
          message = '网关错误!'
          break
        case 503:
          message = '服务不可用!'
          break
        case 504:
          message = '网关超时!'
          break
        case 505:
          message = 'HTTP版本不受支持'
          break
        default:
          message = '请求失败'
      }
      ElMessage({
        type: 'error',
        message: error.message
      })
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export default service
