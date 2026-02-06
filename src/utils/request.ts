import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { showToast } from 'vant'
import router from '@/router'

/**
 * 后端返回的统一结构（与 Go 对齐）
 */
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

/**
 * 请求拦截器
 * 自动携带 token
 */
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * 响应拦截器
 * 统一处理业务 code
 */
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    // 正常返回
    if (res.code === 0) {
      return res.data
    }

    // token 失效 / 未登录
    if (res.code === 401) {
      showToast('登录已过期，请重新登录')
      localStorage.removeItem('token')

      // 防止重复跳转
      if (router.currentRoute.value.path !== '/login') {
        router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath },
        })
      }

      return Promise.reject(res)
    }

    // 其他业务错误
    showToast(res.message || '请求失败，请稍后再试')
    return Promise.reject(res)
  },
  (error) => {
    showToast('网络异常，请检查网络')
    return Promise.reject(error)
  }
)

export default service
