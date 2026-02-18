import { useQuery } from '@tanstack/react-query'
import { symptomService } from '../services/symptom.service'
import { QUERY_KEYS } from '../constants/queryKeys'

export function useInsights(patientId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.patients.insights(patientId),
        queryFn: () => symptomService.getInsights(patientId),
        enabled: !!patientId,
    })
}