export interface Symptom {
    id: string
    patientId: string
    symptomType: string
    severity: number
    occurredAt: string
    notes: string | null
    createdAt: string
}

export interface CreateSymptomPayload {
    symptomType: string
    severity: number
    occurredAt: string
    notes?: string
}

export interface UpdateSymptomPayload {
    symptomType?: string
    severity?: number
    occurredAt?: string
    notes?: string
}

export interface SymptomFilters {
    symptomType?: string
    severity?: number
    from?: string
    to?: string
    page?: number
    limit?: number
}

export interface PaginationMeta {
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface PaginatedResponse<T> {
    data: T[]
    meta: PaginationMeta
}