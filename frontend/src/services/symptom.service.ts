import api from './api'
import type { Symptom, CreateSymptomPayload, UpdateSymptomPayload, SymptomFilters, PaginatedResponse } from '../types/symptom.types'
import type { InsightsResponse } from '../types/insights.types'

export const symptomService = {
    async getByPatient(patientId: string, filters?: SymptomFilters): Promise<PaginatedResponse<Symptom>> {
        const params: Record<string, string | number> = {}

        if (filters?.symptomType) params.symptomType = filters.symptomType
        if (filters?.severity) params.severity = filters.severity
        if (filters?.from) params.from = filters.from
        if (filters?.to) params.to = filters.to
        if (filters?.page) params.page = filters.page
        if (filters?.limit) params.limit = filters.limit

        const { data } = await api.get<PaginatedResponse<Symptom>>(`/patients/${patientId}/symptoms`, { params })
        return data
    },

    async create(patientId: string, payload: CreateSymptomPayload): Promise<Symptom> {
        const { data } = await api.post<Symptom>(`/patients/${patientId}/symptoms`, payload)
        return data
    },

    async update(patientId: string, symptomId: string, payload: UpdateSymptomPayload): Promise<Symptom> {
        const { data } = await api.patch<Symptom>(`/patients/${patientId}/symptoms/${symptomId}`, payload)
        return data
    },

    async remove(patientId: string, symptomId: string): Promise<void> {
        await api.delete(`/patients/${patientId}/symptoms/${symptomId}`)
    },

    async getInsights(patientId: string): Promise<InsightsResponse> {
        const { data } = await api.get<InsightsResponse>(`/patients/${patientId}/insights`)
        return data
    },
}