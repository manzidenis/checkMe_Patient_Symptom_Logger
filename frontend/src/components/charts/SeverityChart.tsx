import { useMemo, useState } from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
} from 'recharts'
import Card from '../ui/Card'
import Spinner from '../ui/Spinner'
import AlertBanner from '../ui/AlertBanner'
import { useSymptoms } from '../../hooks/useSymptoms'
import { formatSymptomType } from '../../utils/formatters'
import { getSeverityColor } from '../../utils/severityUtils'
import { format, parseISO } from 'date-fns'

interface SeverityChartProps {
    patientId: string
}

type ChartType = 'line' | 'bar'

interface ChartDataPoint {
    date: string
    displayDate: string
    severity: number
    type: string
}

export default function SeverityChart({ patientId }: SeverityChartProps) {
    const [chartType, setChartType] = useState<ChartType>('line')
    const { data, isLoading, isError, error, refetch } = useSymptoms(patientId, { limit: 50 })

    const chartData: ChartDataPoint[] = useMemo(() => {
        if (!data?.data) return []
        return [...data.data]
            .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())
            .map((entry) => ({
                date: entry.occurredAt,
                displayDate: format(parseISO(entry.occurredAt), 'MMM d'),
                severity: entry.severity,
                type: formatSymptomType(entry.symptomType),
            }))
    }, [data])

    const sharedAxisProps = {
        xAxis: {
            dataKey: 'displayDate' as const,
            tick: { fontSize: 11, fill: '#94a3b8' },
            tickLine: false,
            axisLine: { stroke: '#e2e8f0' },
        },
        yAxis: {
            domain: [0, 5] as [number, number],
            ticks: [1, 2, 3, 4, 5],
            tick: { fontSize: 11, fill: '#94a3b8' },
            tickLine: false,
            axisLine: { stroke: '#e2e8f0' },
        },
        tooltip: {
            contentStyle: {
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            },
        },
    }

    return (
        <Card padding="md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Severity Over Time</h2>

                {/* Chart type toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                    <button
                        onClick={() => setChartType('line')}
                        className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
              ${chartType === 'line'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }
            `}
                        aria-pressed={chartType === 'line'}
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2 20l5-10 5 6 4-8 6 4" />
                        </svg>
                        Line
                    </button>
                    <button
                        onClick={() => setChartType('bar')}
                        className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
              ${chartType === 'bar'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }
            `}
                        aria-pressed={chartType === 'bar'}
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V10h4v11M10 21V6h4v15M17 21V3h4v18" />
                        </svg>
                        Bar
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="py-12">
                    <Spinner label="Loading chart data..." />
                </div>
            )}

            {isError && (
                <AlertBanner
                    type="error"
                    message={error instanceof Error ? error.message : 'Failed to load chart data'}
                    onRetry={() => refetch()}
                />
            )}

            {!isLoading && !isError && chartData.length === 0 && (
                <div className="py-12 text-center">
                    <p className="text-sm text-gray-500">No data available for chart</p>
                </div>
            )}

            {!isLoading && chartData.length > 0 && (
                <div className="h-[260px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'line' ? (
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis {...sharedAxisProps.xAxis} />
                                <YAxis {...sharedAxisProps.yAxis} />
                                <Tooltip {...sharedAxisProps.tooltip} />
                                <ReferenceLine
                                    y={4}
                                    stroke="#DC2626"
                                    strokeDasharray="6 4"
                                    strokeWidth={1.5}
                                    label={{ value: 'Alert threshold', position: 'insideTopLeft', fontSize: 11, fill: '#DC2626', fontWeight: 500 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="severity"
                                    stroke="#2563EB"
                                    strokeWidth={2}
                                    dot={{ fill: '#2563EB', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        ) : (
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis {...sharedAxisProps.xAxis} />
                                <YAxis {...sharedAxisProps.yAxis} />
                                <Tooltip {...sharedAxisProps.tooltip} />
                                <ReferenceLine
                                    y={4}
                                    stroke="#DC2626"
                                    strokeDasharray="6 4"
                                    strokeWidth={1.5}
                                    label={{ value: 'Alert threshold', position: 'insideTopLeft', fontSize: 11, fill: '#DC2626', fontWeight: 500 }}
                                />
                                <Bar dataKey="severity" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={getSeverityColor(entry.severity)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    )
}