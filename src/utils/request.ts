import axios, { type AxiosInstance } from 'axios'
import { showToast } from 'vant'
import router from '../router' // 确保路径别名已正确配置

/**
 * 后端返回的统一结构（与 Go 对齐）
 */

/**
 * 从环境变量中读取基础地址，默认为 '/api'
 * 开发者可以通过 .env 文件自定义 VITE_API_BASE_URL
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL, // 使用动态配置的基础地址
  timeout: 10000, // 超时时间 10s
})

/**
 * 请求拦截器
 * 自动携带 token
 */
service.interceptors.request.use(
  (config) => {
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
 * 统一处理业务 code 和错误
 */
service.interceptors.response.use(
  (res) => {
    // 正常返回
    if (res.data.code === 200) {
      return res
    }

    // token 失效 / 未登录
    if (res.data.code === 401) {
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
    showToast(res.data.message || '请求失败，请稍后再试')
    return Promise.reject(res)
  },
  (error) => {
    // 处理网络异常或服务器错误
    if (error.response?.status === 401) {
      // 401 权限不足或 token 过期
      router.push('/login')
    } else {
      // 其他错误统一提示
      showToast(error.response?.data?.message || '网络异常，请检查网络')
    }
    return Promise.reject(error)
  }
)

export default service
export { baseURL }