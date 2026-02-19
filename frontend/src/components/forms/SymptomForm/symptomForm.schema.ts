import { z } from 'zod'
import { SymptomType } from '../../../constants/symptomTypes'

const symptomTypeValues = Object.values(SymptomType) as [string, ...string[]]
const MAX_NOTES_WORDS = 90

const countWords = (value: string): number => {
    const normalized = value.trim()
    if (!normalized) return 0
    return normalized.split(/\s+/).length
}

export const symptomFormSchema = z.object({
    symptomType: z.enum(symptomTypeValues, { errorMap: () => ({ message: 'Please select a symptom type' }) }),
    severity: z.coerce.number().int().min(1, 'Severity must be at least 1').max(5, 'Severity must be at most 5'),
    occurredAt: z.string().min(1, 'Date of occurrence is required'),
    notes: z
        .string()
        .optional()
        .or(z.literal(''))
        .refine((value) => !value || countWords(value) <= MAX_NOTES_WORDS, {
            message: `Notes must contain at most ${MAX_NOTES_WORDS} words`,
        }),
})

export type SymptomFormValues = z.infer<typeof symptomFormSchema>

export { MAX_NOTES_WORDS, countWords }
