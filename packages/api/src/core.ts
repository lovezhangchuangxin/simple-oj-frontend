import axios, { AxiosRequestConfig } from 'axios'
import { DafaultRequestMethod, ResponseData } from './types'

// 创建 axios 实例
export const instance = axios.create({
  baseURL: `http://${import.meta.env.HUST_HOST}:${import.meta.env.HUST_PORT}`,
  timeout: 5000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 通用请求方法
export const req = async <T>(
  method: DafaultRequestMethod,
  url: string,
  data?: any,
  config: AxiosRequestConfig = {},
): Promise<ResponseData<T>> => {
  config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
    method,
  }

  if (method === 'GET' || method === 'DELETE') {
    config.params = JSON.stringify(data)
  } else {
    config.data = JSON.stringify(data)
  }

  return (await instance(url, config)).data
}
