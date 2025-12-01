// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3254',
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Auto logout on 401 or expired token
    if (err?.response?.status === 401) {
      localStorage.clear()
      window.location.hash = '#/login'
    }
    return Promise.reject(err)
  }
)

export default api
