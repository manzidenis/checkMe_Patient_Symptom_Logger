import Card from '../ui/Card'
import { formatSymptomType } from '../../utils/formatters'

interface TopSymptomCardProps {
    topSymptom: string | null
    count: number
    totalEntries: number
}

export default function TopSymptomCard({ topSymptom, count, totalEntries }: TopSymptomCardProps) {
    return (
        <Card padding="md">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Top Symptom (30d)</p>
                    <p className="text-sm font-semibold text-gray-900">
                        {topSymptom ? formatSymptomType(topSymptom) : 'No data'}
                    </p>
                    {topSymptom && (
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="font-medium text-gray-700">{count}x</span> reported · {totalEntries} total entries
                        </p>
                    )}
                </div>
            </div>
        </Card>
    )
}