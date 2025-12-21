import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8888',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'withCredentials': true, // true允许跨域
  },
})

// 定义响应数据的类型
export interface ResponseBody<T = any> {
  code?: number
  data: T
  message: string
  success: boolean
  [key: string]: any
}

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    if (response.status === 200) {
      return response
    }
    return Promise.reject(response)
  },
  // 服务器状态码不是2开头的的情况
  (error) => {
    if (!error.response) {
      return handleNetworkError()
    }
    if (error.response?.status) {
      switch (error.response.status) {
        // 401: 未登录
        case 401:
          router.replace({ path: '/' })
          break
        case 403:
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({ path: '/' })
          }, 1000)
          break

        // 404请求不存在
        case 404:
          console.warn('请求的资源不存在')
          break
      }
      return Promise.reject(error.response)
    }
    return Promise.reject(error)
  },
)

function handleNetworkError() {
  ElMessage.error({
    message: '网络连接异常，请检查网络设置',
  })
}

export function getBaseURL() {
  return axios.defaults.baseURL
}

/**
 * 封装get方法
 * @param url 请求地址
 * @param params 请求参数
 * @returns {Promise} 返回请求结果的Promise
 */
export async function get<T = any>(url: string, params?: object): Promise<ResponseBody<T>> {
  const response = await request.get<ResponseBody<T>>(url, { params })
  return response.data
}

/**
 * 封装post请求
 * @param url 请求地址
 * @param data 请求数据
 * @returns {Promise} 返回请求结果的Promise
 */
export async function post<T = any>(url: string, data: object = {}): Promise<ResponseBody<T>> {
  const response = await request.post<ResponseBody<T>>(url, data)
  return response.data
}

/**
 * 封装delete请求
 * @param url 请求地址
 * @param data 请求数据
 * @returns {Promise} 返回请求结果的Promise
 */
export async function deletes<T = any>(url: string, data: object = {}): Promise<ResponseBody<T>> {
  const response = await request.delete<ResponseBody<T>>(url, { data })
  return response.data
}

/**
 * 封装put请求
 * @param url 请求地址
 * @param data 请求数据
 * @returns {Promise} 返回请求结果的Promise
 */
export async function put<T = any>(url: string, data: object = {}): Promise<ResponseBody<T>> {
  const response = await request.put<ResponseBody<T>>(url, data)
  return response.data
}

// Request caching mechanism
const apiCache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getCached<T = any>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = apiCache.get(key)
  const now = Date.now()

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data
  }

  const data = await fetcher()
  apiCache.set(key, { data, timestamp: now })
  return data
}
