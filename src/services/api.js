import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow-token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getAssetUrl(path) {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

export function getApiErrorMessage(error) {
  const data = error.response?.data

  if (data?.validationErrors) {
    return Object.values(data.validationErrors)[0]
  }

  return data?.message || 'Something went wrong. Please try again.'
}
