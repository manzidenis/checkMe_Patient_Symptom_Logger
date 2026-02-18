import { useQuery } from '@tanstack/react-query'
import { patientService } from '../services/patient.service'
import { QUERY_KEYS } from '../constants/queryKeys'
import type { PatientFilters } from '../types/patient.types'

export function usePatients(filters?: PatientFilters) {
    return useQuery({
        queryKey: QUERY_KEYS.patients.all(filters),
        queryFn: () => patientService.getAll(filters),
    })
}