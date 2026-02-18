import { useMutation, useQueryClient } from '@tanstack/react-query'
import { symptomService } from '../services/symptom.service'
import { QUERY_KEYS } from '../constants/queryKeys'
import type { CreateSymptomPayload } from '../types/symptom.types'

export function useCreateSymptom(patientId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateSymptomPayload) =>
            symptomService.create(patientId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.symptoms(patientId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.insights(patientId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
        },
    })
}