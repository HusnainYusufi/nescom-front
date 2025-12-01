// src/services/authService.js
import api from './api'

const authService = {
  // Perform login
  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password })
    if (!data?.data) throw new Error('Invalid response from server')

    const user = data.data.user || {}
    const accessToken = data.data.accessToken
    const refreshToken = data.data.refreshToken
    const expiresAt = data.data.expiresAt

    // Store for later
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('expiresAt', expiresAt)
    localStorage.setItem('userId', user.id || '')
    localStorage.setItem('userName', user.name || '')
    localStorage.setItem('userEmail', user.email || '')
    localStorage.setItem('userRole', user.role?.name || '')

    return {
      status: data.status,
      message: data.message,
      user,
      accessToken,
      refreshToken,
      expiresAt,
    }
  },

  // Logout
  logout: () => {
    localStorage.clear()
  },

  // Auth check
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken')
    const expiresAt = localStorage.getItem('expiresAt')
    if (!token || !expiresAt) return false
    return new Date(expiresAt) > new Date()
  },

  // ----- Compatibility Helpers -----
  getCurrentNameFromToken: () => {
    return localStorage.getItem('userName') || ''
  },

  getCurrentEmailFromToken: () => {
    return localStorage.getItem('userEmail') || ''
  },

  getCurrentRoleFromToken: () => {
    return localStorage.getItem('userRole') || ''
  },

  getCurrentUserIdFromToken: () => {
    return localStorage.getItem('userId') || ''
  },
  // ---------------------------------

  getUser: () => ({
    id: localStorage.getItem('userId'),
    name: localStorage.getItem('userName'),
    email: localStorage.getItem('userEmail'),
    role: localStorage.getItem('userRole'),
  }),

  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
}

export default authService
