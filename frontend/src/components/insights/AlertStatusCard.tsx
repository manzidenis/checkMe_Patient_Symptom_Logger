import Card from '../ui/Card'

interface AlertStatusCardProps {
    alert: boolean
    alertDetails: string
}

export default function AlertStatusCard({ alert, alertDetails }: AlertStatusCardProps) {
    return (
        <Card padding="md">
            <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${alert ? 'bg-red-50' : 'bg-green-50'}`}>
                    {alert ? (
                        <svg className="h-5 w-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Alert Status</p>
                    <p className={`text-sm font-semibold ${alert ? 'text-danger' : 'text-success'}`}>
                        {alert ? 'Active Alert' : 'No Active Alerts'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{alertDetails}</p>
                </div>
            </div>
        </Card>
    )
}