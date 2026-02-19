export interface Patient {
    id: string
    firstName: string
    lastName: string
    middleName: string | null
    fullName: string
    dateOfBirth: string
    age: number
    sex: 'MALE' | 'FEMALE' | 'OTHER'
    phone: string
    email: string
    country: string
    city: string
    createdAt: string
    updatedAt: string
    symptomCount: number
}

export interface CreatePatientPayload {
    firstName: string
    lastName: string
    middleName?: string
    dateOfBirth: string
    sex: 'MALE' | 'FEMALE' | 'OTHER'
    phone: string
    email: string
    country: string
    city: string
}

export interface UpdatePatientPayload {
    firstName?: string
    lastName?: string
    middleName?: string
    dateOfBirth?: string
    sex?: 'MALE' | 'FEMALE' | 'OTHER'
    phone?: string
    email?: string
    country?: string
    city?: string
}

export interface PatientFilters {
    search?: string
    sex?: string
    country?: string
    city?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
}

export interface PaginationMeta {
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface PaginatedPatients {
    data: Patient[]
    meta: PaginationMeta
}
