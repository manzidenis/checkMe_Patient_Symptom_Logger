export type SeverityLevel = 1 | 2 | 3 | 4 | 5

interface SeverityInfo {
    label: string
    color: string
    bgColor: string
    textColor: string
}

const SEVERITY_MAP: Record<number, SeverityInfo> = {
    1: { label: 'Mild', color: '#16A34A', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    2: { label: 'Low', color: '#16A34A', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    3: { label: 'Moderate', color: '#F59E0B', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
    4: { label: 'High', color: '#DC2626', bgColor: 'bg-red-50', textColor: 'text-red-700' },
    5: { label: 'Severe', color: '#DC2626', bgColor: 'bg-red-50', textColor: 'text-red-700' },
}

export function getSeverityInfo(severity: number): SeverityInfo {
    return SEVERITY_MAP[severity] || SEVERITY_MAP[3]
}

export function getSeverityColor(severity: number): string {
    return getSeverityInfo(severity).color
}

export function getSeverityLabel(severity: number): string {
    return getSeverityInfo(severity).label
}

export function getSeverityBgClass(severity: number): string {
    return `${getSeverityInfo(severity).bgColor} ${getSeverityInfo(severity).textColor}`
}