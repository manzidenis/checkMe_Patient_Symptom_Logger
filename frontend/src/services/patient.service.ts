import api from './api'
import type { Patient, CreatePatientPayload, UpdatePatientPayload, PatientFilters, PaginatedPatients } from '../types/patient.types'

export const patientService = {
    async getAll(filters?: PatientFilters): Promise<PaginatedPatients> {
        const params: Record<string, string | number> = {}

        if (filters?.search) params.search = filters.search
        if (filters?.sex) params.sex = filters.sex
        if (filters?.country) params.country = filters.country
        if (filters?.city) params.city = filters.city
        if (filters?.sortBy) params.sortBy = filters.sortBy
        if (filters?.sortOrder) params.sortOrder = filters.sortOrder
        if (filters?.page) params.page = filters.page
        if (filters?.limit) params.limit = filters.limit

        const { data } = await api.get<PaginatedPatients>('/patients', { params })
        return data
    },

    async getById(id: string): Promise<Patient> {
        const { data } = await api.get<Patient>(`/patients/${id}`)
        return data
    },

    async create(payload: CreatePatientPayload): Promise<Patient> {
        const { data } = await api.post<Patient>('/patients', payload)
        return data
    },

    async update(id: string, payload: UpdatePatientPayload): Promise<Patient> {
        const { data } = await api.patch<Patient>(`/patients/${id}`, payload)
        return data
    },

    async remove(id: string): Promise<void> {
        await api.delete(`/patients/${id}`)
    },
}