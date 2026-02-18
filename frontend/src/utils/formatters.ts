import { SYMPTOM_TYPE_LABELS } from '../constants/symptomTypes'
import type { SymptomType } from '../constants/symptomTypes'

export function formatSymptomType(type: string): string {
    return SYMPTOM_TYPE_LABELS[type as SymptomType] || type.replace(/_/g, ' ')
}

export function formatSex(sex: string): string {
    const map: Record<string, string> = {
        MALE: 'Male',
        FEMALE: 'Female',
        OTHER: 'Other',
    }
    return map[sex] || sex
}

export function capitalize(str: string): string {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatTrend(trend: string): string {
    const map: Record<string, string> = {
        worsening: 'Worsening',
        improving: 'Improving',
        stable: 'Stable',
        insufficient_data: 'Insufficient Data',
        no_data: 'No Data',
    }
    return map[trend] || capitalize(trend)
}