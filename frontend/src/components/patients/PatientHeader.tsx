import { useNavigate } from 'react-router-dom'
import type { Patient } from '../../types/patient.types'
import { formatSex } from '../../utils/formatters'
import { formatDate } from '../../utils/date'
import Badge from '../ui/Badge'
import { useAuth } from '../../context/AuthContext'

interface PatientHeaderProps {
    patient: Patient
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
    const navigate = useNavigate()
    const { isClinician } = useAuth()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 ">
            {/* Back button — only for clinicians */}
            {isClinician && (
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors self-start"
                    aria-label="Back to patient list"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    All Patients
                </button>
            )}

            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Avatar */}
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                        {patient.firstName.charAt(0).toUpperCase()}
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <h1 className="text-sm font-bold text-gray-900 truncate">
                        {patient.fullName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-1 mt-0">
                        <span className="text-sm text-gray-500">{patient.age} years old</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">{formatSex(patient.sex)}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">{patient.phone}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">{patient.city}, {patient.country}</span>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <Badge variant="blue">{patient.symptomCount} entries</Badge>
                    <span className="text-xs text-gray-400">Since {formatDate(patient.createdAt)}</span>
                </div>
            </div>
        </div>
    )
}