// src/stores/modules/user.ts
import { defineStore } from 'pinia'

// 定义用户信息接口
interface UserInfo {
  user_id: number
  nickname: string
  phone: string
  avatar: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null as UserInfo | null
  }),
  actions: {
    // 设置用户信息和 Token
    setUserInfo(data: { token: string; userInfo: UserInfo }) {
      this.token = data.token
      this.userInfo = data.userInfo
    },
    // 清除用户信息和 Token（登出）
    clearUserInfo() {
      this.token = ''
      this.userInfo = null
    }
  },
  persist: {
    key: 'user-store',
    storage: localStorage
  }
})