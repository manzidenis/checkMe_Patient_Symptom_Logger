import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import type { Patient } from '../../types/patient.types'
import { formatSex } from '../../utils/formatters'
import { formatRelative } from '../../utils/date'

interface PatientCardProps {
    patient: Patient
}

export default function PatientCard({ patient }: PatientCardProps) {
    const navigate = useNavigate()

    return (
        <Card
            className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
            padding="md"
        >
            <div
                onClick={() => navigate(`/patients/${patient.id}`)}
                className="flex items-center justify-between gap-4"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/patients/${patient.id}`)}
            >
                <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                            {patient.firstName.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                            {patient.fullName}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {patient.age} yrs · {formatSex(patient.sex)} · {patient.city}, {patient.country} · {formatRelative(patient.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={patient.symptomCount > 0 ? 'blue' : 'gray'}>
                        {patient.symptomCount} {patient.symptomCount === 1 ? 'entry' : 'entries'}
                    </Badge>
                    <svg className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
        </Card>
    )
}