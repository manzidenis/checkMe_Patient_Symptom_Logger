import { useQuery } from '@tanstack/react-query'
import { patientService } from '../services/patient.service'
import { QUERY_KEYS } from '../constants/queryKeys'

export function usePatientDetails(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.patients.detail(id),
        queryFn: () => patientService.getById(id),
        enabled: !!id,
    })
}