export type SeverityTrend = 'worsening' | 'improving' | 'stable' | 'insufficient_data' | 'no_data'

export interface InsightsResponse {
    topSymptom: string | null
    topSymptomCount: number
    severityTrend: SeverityTrend
    avgSeverityLast7Days: number | null
    avgSeverityPrev7Days: number | null
    alert: boolean
    alertDetails: string
    totalEntries: number
    periodStart: string
    periodEnd: string
}