import Spinner from '../ui/Spinner'
import AlertBanner from '../ui/AlertBanner'
import AlertStatusCard from './AlertStatusCard'
import SeverityTrendCard from './SeverityTrendCard'
import TopSymptomCard from './TopSymptomCard'
import { useInsights } from '../../hooks/useInsights'

interface InsightsPanelProps {
    patientId: string
}

export default function InsightsPanel({ patientId }: InsightsPanelProps) {
    const { data, isLoading, isError, error, refetch } = useInsights(patientId)

    if (isLoading) {
        return (
            <div className="py-8">
                <Spinner label="Loading insights..." />
            </div>
        )
    }

    if (isError) {
        return (
            <AlertBanner
                type="error"
                message={error instanceof Error ? error.message : 'Failed to load insights'}
                onRetry={() => refetch()}
            />
        )
    }

    if (!data) return null

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AlertStatusCard alert={data.alert} alertDetails={data.alertDetails} />
            <SeverityTrendCard
                trend={data.severityTrend}
                avgCurrent={data.avgSeverityLast7Days}
                avgPrevious={data.avgSeverityPrev7Days}
            />
            <TopSymptomCard
                topSymptom={data.topSymptom}
                count={data.topSymptomCount}
                totalEntries={data.totalEntries}
            />
        </div>
    )
}