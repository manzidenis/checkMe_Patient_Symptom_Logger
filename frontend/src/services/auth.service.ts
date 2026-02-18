import api from './api'
import type { LoginPayload, LoginResponse, AuthUser } from '../types/auth.types'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const authService = {
    async login(payload: LoginPayload): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>('/auth/login', payload)
        localStorage.setItem(TOKEN_KEY, data.access_token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        return data
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    },

    getStoredToken(): string | null {
        return localStorage.getItem(TOKEN_KEY)
    },

    getStoredUser(): AuthUser | null {
        const raw = localStorage.getItem(USER_KEY)
        if (!raw) return null
        try {
            return JSON.parse(raw) as AuthUser
        } catch {
            return null
        }
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem(TOKEN_KEY)
    },
}
