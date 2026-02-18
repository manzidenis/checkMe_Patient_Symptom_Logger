import Card from '../ui/Card'
import type { SeverityTrend } from '../../types/insights.types'
import { formatTrend } from '../../utils/formatters'

interface SeverityTrendCardProps {
    trend: SeverityTrend
    avgCurrent: number | null
    avgPrevious: number | null
}

function getTrendConfig(trend: SeverityTrend) {
    switch (trend) {
        case 'improving':
            return { icon: '↓', color: 'text-success', bgColor: 'bg-green-50', label: 'Improving' }
        case 'worsening':
            return { icon: '↑', color: 'text-danger', bgColor: 'bg-red-50', label: 'Worsening' }
        case 'stable':
            return { icon: '→', color: 'text-warning', bgColor: 'bg-amber-50', label: 'Stable' }
        default:
            return { icon: '—', color: 'text-gray-400', bgColor: 'bg-gray-50', label: formatTrend(trend) }
    }
}

export default function SeverityTrendCard({ trend, avgCurrent, avgPrevious }: SeverityTrendCardProps) {
    const config = getTrendConfig(trend)

    return (
        <Card padding="md">
            <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${config.bgColor}`}>
                    <span className={`text-lg font-bold ${config.color}`}>{config.icon}</span>
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Severity Trend</p>
                    <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
                    {avgCurrent !== null && (
                        <p className="text-xs text-gray-500 mt-1">
                            Last 7d avg: <span className="font-medium text-gray-700">{avgCurrent.toFixed(1)}</span>
                            {avgPrevious !== null && (
                                <> · Prior 7d: <span className="font-medium text-gray-700">{avgPrevious.toFixed(1)}</span></>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    )
}