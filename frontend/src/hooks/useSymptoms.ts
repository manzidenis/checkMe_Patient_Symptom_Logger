import { useQuery } from '@tanstack/react-query'
import { symptomService } from '../services/symptom.service'
import { QUERY_KEYS } from '../constants/queryKeys'
import type { SymptomFilters } from '../types/symptom.types'

export function useSymptoms(patientId: string, filters?: SymptomFilters) {
    return useQuery({
        queryKey: QUERY_KEYS.patients.symptoms(patientId, filters),
        queryFn: () => symptomService.getByPatient(patientId, filters),
        enabled: !!patientId,
    })
}