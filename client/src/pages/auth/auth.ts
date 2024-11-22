import router from '@/router'
import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  userInfo: any | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const token = localStorage.getItem('token')
    const userInfoStr = localStorage.getItem('userInfo')
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null

    return {
      token: token,
      isAuthenticated: !!token,
      userInfo: userInfo
    }
  },

  actions: {
    setToken(token: string) {
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('token', token)
    },

    setUserInfo(info: any) {
      this.userInfo = info
      localStorage.setItem('userInfo', JSON.stringify(info))
    },

    logout() {
      this.token = null
      this.isAuthenticated = false
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  },

  getters: {
    getToken: (state): string | null => state.token,
    getUserInfo: (state): any | null => {
      return state.userInfo
    }
  }
})
