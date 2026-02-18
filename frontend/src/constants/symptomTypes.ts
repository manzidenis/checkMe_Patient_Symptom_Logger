export enum SymptomType {
    BREAST_PAIN = 'BREAST_PAIN',
    LUMP_DETECTED = 'LUMP_DETECTED',
    SKIN_CHANGES = 'SKIN_CHANGES',
    NIPPLE_DISCHARGE = 'NIPPLE_DISCHARGE',
    SWELLING = 'SWELLING',
    FATIGUE = 'FATIGUE',
    OTHER = 'OTHER',
}

export const SYMPTOM_TYPE_LABELS: Record<SymptomType, string> = {
    [SymptomType.BREAST_PAIN]: 'Breast Pain',
    [SymptomType.LUMP_DETECTED]: 'Lump Detected',
    [SymptomType.SKIN_CHANGES]: 'Skin Changes',
    [SymptomType.NIPPLE_DISCHARGE]: 'Nipple Discharge',
    [SymptomType.SWELLING]: 'Swelling',
    [SymptomType.FATIGUE]: 'Fatigue',
    [SymptomType.OTHER]: 'Other',
}

export const SYMPTOM_TYPE_OPTIONS = Object.entries(SYMPTOM_TYPE_LABELS).map(
    ([value, label]) => ({ value, label })
)