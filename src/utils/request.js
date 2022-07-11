import axios from "axios"
import qs from "qs"
import { getToken, setToken, getRefreshToken } from "@utils/auth"
import { Loading, Message } from "element-ui"
import domMessage from "./messageOnce"
let isRefreshing = false // 标记是否正在刷新 token

// new 对象实例
const messageOnce = new domMessage()
// 设置baseURL，判断当前环境是否为生产环境，若不是需设置自己的apiURL
let baseURL = process.env.NODE_ENV !== "production" ? "/" : "/"
let config = {
  baseURL,
  timeout: 60 * 1000, // 请求超时时间
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
}
var controller = new AbortController()
var signal = controller.signal
// cancel the request
controller.abort()

let loadingInstance

const service = axios.create(config)

// 用于存储pending的请求（处理多条相同请求）
const pendingRequest = new Map()
let CancelToken = axios.CancelToken
// http request 拦截器
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (config.loadingOptions) loadingInstance = Loading.service(config.loadingOptions)
    // 处理重复请求
    removePendingRequest(config)
    addPendingRequest(config)
    if (config.method === "get") {
      let res = handleGetUrl(config.url, config.params)
      config.url = res.url
      config.params = res.params
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error)
    if (loadingInstance) loadingInstance.close()
    return Promise.reject(error)
  }
)

// http response 拦截器
service.interceptors.response.use(
  response => {
    // Do something with response data
    if (loadingInstance) loadingInstance.close()
    removePendingRequest(response.config)
    console.log(response)
    return response.data
  },
  error => {
    // Do something with response error
    console.log(error)
    if (loadingInstance) loadingInstance.close()
    // return Promise.reject(error)
    handleError(error)
  }
)

// 二次封装方法
/**
 * 接收三个参数，配置参数config可不传
 * @param {String} url
 * @param {Object} data
 * @param {Object} config
 */
const getFn = async (url, data, config = {}) => {
  let params = { params: data, ...config }
  try {
    return _axios.get(url, params)
  } catch (error) {
    return handleError(error)
  }
}
/**
 * 接收三个参数，配置参数config可不传
 * @param {String} url
 * @param {Object} data
 * @param {Object} config
 */
const postFn = async (url, data, config = {}) => {
  try {
    return _axios.post(url, data, config)
  } catch (error) {
    return handleError(error)
  }
}
const deleteFn = async (url, data) => {
  try {
    return _axios.delete(url, data)
  } catch (error) {
    return handleError(error)
  }
}

// 判断请求是否在队列中，如果在就执行取消请求
const judgePendingFunc = function (config) {
  if (pendingQueue.has(`${config.method}->${config.url}`)) {
    pendingQueue.get(`${config.method}->${config.url}`)()
  }
}
// 删除队列中对应已执行的请求
const removeResolvedFunc = function (config) {
  if (pendingQueue.has(`${config.method}->${config.url}`)) {
    pendingQueue.delete(`${config.method}->${config.url}`)
  }
}
// 处理get请求功能性字符和非功能性字符被转换导致的问题
const handleGetUrl = function (url, params) {
  if (!params) return { url: url, params: params }
  let parts = []
  let resUrl = url
  let resParams = params
  let keys = Object.keys(params)
  if (keys.length > 0) {
    for (let key of keys) {
      let values = []
      if (Array.isArray(params[key])) {
        values = params[key]
        key += "[]"
      } else values = [params[key]]
      values.forEach(val => {
        if (val || val === 0) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      })
    }
    let serializedParams = parts.join("&")
    if (serializedParams) {
      resUrl += (resUrl.includes("?") ? "&" : "?") + serializedParams
    }
  }
  return { url: resUrl, params: resParams }
}

export default {
  get: getFn,
  post: postFn,
  delete: deleteFn,
}

// 生成request的唯一key
const generateRequestKey = (config = {}) => {
  // 通过url，method，params，data生成唯一key，用于判断是否重复请求
  // params为get请求参数，data为post请求参数
  const { url, method, params, data } = config
  return [url, method, qs.stringify(params), qs.stringify(data)].join("&")
}

// 将重复请求添加到pendingRequest中
const addPendingRequest = config => {
  const key = generateRequestKey(config)
  if (!pendingRequest.has(key)) {
    config.cancelToken = new axios.CancelToken(cancel => {
      pendingRequest.set(key, cancel)
    })
  }
}

// 取消重复请求
const removePendingRequest = config => {
  const key = generateRequestKey(config)
  if (pendingRequest.has(key)) {
    const cancelToken = pendingRequest.get(key)
    cancelToken(key) // 取消之前发送的请求
    pendingRequest.delete(key) // 请求对象中删除requestKey
  }
}

/**
 * 处理异常
 * @param {*} error
 */
function handleError(error) {
  // 处理被取消的请求
  if (_axios.isCancel(error)) return console.error("请求的重复请求：" + error.message)
  let message = ""
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = "接口重定向了！"
        break
      case 400:
        message = "参数不正确！"
        break
      case 401:
        message = "您未登录，或者登录已经超时，请先登录！"
        break
      case 403:
        message = "您没有权限操作！"
        break
      case 404:
        message = `请求地址出错: ${error.response.config.url}`
        break // 在正确域名下
      case 408:
        message = "请求超时！"
        break
      case 409:
        message = "系统已存在相同数据！"
        break
      case 500:
        message = "服务器内部错误！"
        break
      case 501:
        message = "服务未实现！"
        break
      case 502:
        message = "网关错误！"
        break
      case 503:
        message = "服务不可用！"
        break
      case 504:
        message = "服务暂时无法访问，请稍后再试！"
        break
      case 505:
        message = "HTTP版本不受支持！"
        break
      default:
        message = "异常问题，请联系管理员！"
        break
    }
  }
  if (error.message.includes("timeout")) message = "网络请求超时！"
  if (error.message.includes("Network")) message = window.navigator.onLine ? "服务端异常！" : "您断网了！"

  messageOnce.error(message)

  return Promise.reject(error)
}
