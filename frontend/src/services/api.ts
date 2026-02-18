import axios from 'axios'
import { API_BASE_URL } from '../config/env'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Normalize error responses + handle 401 (session expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Auto-logout on 401 (skip for login endpoint)
            if (error.response.status === 401 && !error.config.url?.includes('/auth/login')) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
                window.location.href = '/login'
                return Promise.reject(new Error('Session expired. Please login again.'))
            }

            const data = error.response.data
            const message =
                typeof data?.message === 'string'
                    ? data.message
                    : Array.isArray(data?.message)
                        ? data.message.join('. ')
                        : 'An unexpected error occurred'
            return Promise.reject(new Error(message))
        }

        if (error.request) {
            return Promise.reject(new Error('Unable to reach the server. Please check your connection.'))
        }

        return Promise.reject(new Error(error.message || 'An unexpected error occurred'))
    }
)

export default api