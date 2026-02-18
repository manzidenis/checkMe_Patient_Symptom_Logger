import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patientService } from '../../services/patient.service'
import { QUERY_KEYS } from '../../constants/queryKeys'
import PatientForm from '../../components/forms/PatientForm/PatientForm'
import type { PatientFormValues } from '../../components/forms/PatientForm/patientForm.schema'
import Card from '../../components/ui/Card'
import { useUI } from '../../context/UIContext'

export default function NewPatientPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { showToast } = useUI()

    const createMutation = useMutation({
        mutationFn: patientService.create,
        onSuccess: (patient) => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
            showToast('success', 'Patient registered successfully')
            navigate(`/patients/${patient.id}`)
        },
    })

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-4"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to Patients
                </button>
                <h1 className="text-xl font-bold text-gray-900">Register New Patient</h1>
                <p className="text-sm text-gray-500 mt-1">Fill in the patient's details below</p>
            </div>

            <Card>
                <PatientForm
                    onSubmit={(data: PatientFormValues) => createMutation.mutate(data)}
                    isLoading={createMutation.isPending}
                />
            </Card>
        </div>
    )
}