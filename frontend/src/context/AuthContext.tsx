import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import { authService } from '../services/auth.service'
import type { AuthUser, LoginPayload, LoginResponse } from '../types/auth.types'

interface AuthContextType {
    user: AuthUser | null
    isAuthenticated: boolean
    isClinician: boolean
    isPatient: boolean
    login: (payload: LoginPayload) => Promise<LoginResponse>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser())

    const login = useCallback(async (payload: LoginPayload) => {
        const response = await authService.login(payload)
        setUser(response.user)
        return response
    }, [])

    const logout = useCallback(() => {
        authService.logout()
        setUser(null)
    }, [])

    const value = useMemo<AuthContextType>(() => ({
        user,
        isAuthenticated: !!user,
        isClinician: user?.role === 'CLINICIAN',
        isPatient: user?.role === 'PATIENT',
        login,
        logout,
    }), [user, login, logout])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
