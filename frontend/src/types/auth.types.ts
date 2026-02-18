export type UserRole = 'CLINICIAN' | 'PATIENT'

export interface AuthUser {
    id: string
    email: string
    role: UserRole
    patientId: string | null
}

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    user: AuthUser
}
