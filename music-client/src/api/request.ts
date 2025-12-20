import type { AxiosResponse } from 'axios'
import axios from 'axios'
import router from '@/router'

axios.defaults.timeout = 5000 // 超时时间设置
axios.defaults.withCredentials = true // true允许跨域
axios.defaults.baseURL = 'http://localhost:8888'
// Content-Type 响应头 - Using JSON format
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 定义响应数据的类型
export interface ResponseBody<T = any> {
  code?: number
  data: T
  message: string
  success: boolean
  [key: string]: any
}

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response)
    }
    return Promise.reject(response)
  },
  // 服务器状态码不是2开头的的情况
  (error) => {
    if (error.response?.status) {
      switch (error.response.status) {
        // 401: 未登录
        case 401:
          router.replace({ path: '/' })
          break
        case 403:
          // console.log('管理员权限已修改请重新登录')
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({ path: '/' })
          }, 1000)
          break

        // 404请求不存在
        case 404:
          // console.log('请求页面飞到火星去了')
          break
      }
      return Promise.reject(error.response)
    }
    return Promise.reject(error)
  },
)

export function getBaseURL() {
  return axios.defaults.baseURL
}

/**
 * 封装get方法
 * @param url 请求地址
 * @param params 请求参数
 * @returns {Promise} 返回请求结果的Promise
 */
export function get<T = any>(url: string, params?: object): Promise<ResponseBody<T>> {
  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(
      (response: AxiosResponse<ResponseBody<T>>) => resolve(response.data),
      error => reject(error),
    )
  })
}

/**
 * 封装post请求
 * @param url 请求地址
 * @param data 请求数据
 * @returns {Promise} 返回请求结果的Promise
 */
export function post<T = any>(url: string, data: object = {}): Promise<ResponseBody<T>> {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      (response: AxiosResponse<ResponseBody<T>>) => resolve(response.data),
      error => reject(error),
    )
  })
}

/**
 * 封装delete请求
 * @param url 请求地址
 * @param data 请求数据
 * @returns {Promise} 返回请求结果的Promise
 */
export function deletes<T = any>(url: string, data: object = {}): Promise<ResponseBody<T>> {
  return new Promise((resolve, reject) => {
    axios.delete(url, { data }).then(
      (response: AxiosResponse<ResponseBody<T>>) => resolve(response.data),
      error => reject(error),
    )
  })
}

/**
 * 封装put请求
 * @param url 请求地址
 * @param data 请求数据
 * @returns {Promise} 返回请求结果的Promise
 */
export function put<T = any>(url: string, data: object = {}): Promise<ResponseBody<T>> {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      (response: AxiosResponse<ResponseBody<T>>) => resolve(response.data),
      error => reject(error),
    )
  })
}
