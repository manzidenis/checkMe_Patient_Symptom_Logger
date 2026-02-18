import type { SymptomFilters } from '../types/symptom.types'
import type { PatientFilters } from '../types/patient.types'

export const QUERY_KEYS = {
    patients: {
        all: (filters?: PatientFilters) => ['patients', filters] as const,
        detail: (id: string) => ['patients', id] as const,
        symptoms: (id: string, filters?: SymptomFilters) => ['patients', id, 'symptoms', filters] as const,
        insights: (id: string) => ['patients', id, 'insights'] as const,
    },
}