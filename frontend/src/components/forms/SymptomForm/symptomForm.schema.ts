import { z } from 'zod'
import { SymptomType } from '../../../constants/symptomTypes'

const symptomTypeValues = Object.values(SymptomType) as [string, ...string[]]

export const symptomFormSchema = z.object({
    symptomType: z.enum(symptomTypeValues, { errorMap: () => ({ message: 'Please select a symptom type' }) }),
    severity: z.coerce.number().int().min(1, 'Severity must be at least 1').max(5, 'Severity must be at most 5'),
    occurredAt: z.string().min(1, 'Date of occurrence is required'),
    notes: z.string().max(500, 'Notes must be under 500 characters').optional().or(z.literal('')),
})

export type SymptomFormValues = z.infer<typeof symptomFormSchema>