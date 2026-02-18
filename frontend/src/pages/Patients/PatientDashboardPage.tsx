import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePatientDetails } from '../../hooks/usePatientDetails'
import { useCreateSymptom } from '../../hooks/useCreateSymptom'
import { patientService } from '../../services/patient.service'
import { QUERY_KEYS } from '../../constants/queryKeys'
import DashboardLayout from '../../layouts/DashboardLayout'
import PatientHeader from '../../components/patients/PatientHeader'
import InsightsPanel from '../../components/insights/InsightsPanel'
import SeverityChart from '../../components/charts/SeverityChart'
import SymptomTable from '../../components/symptoms/SymptomTable/SymptomTable'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import AlertBanner from '../../components/ui/AlertBanner'
import SymptomForm from '../../components/forms/SymptomForm/SymptomForm'
import PatientForm from '../../components/forms/PatientForm/PatientForm'
import type { SymptomFormValues } from '../../components/forms/SymptomForm/symptomForm.schema'
import type { PatientFormValues } from '../../components/forms/PatientForm/patientForm.schema'
import type { UpdatePatientPayload } from '../../types/patient.types'
import { useUI } from '../../context/UIContext'
import { useAuth } from '../../context/AuthContext'

export default function PatientDashboardPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

    const { data: patient, isLoading, isError, error, refetch } = usePatientDetails(id!)
    const createSymptom = useCreateSymptom(id!)
    const { showToast } = useUI()
    const { isClinician } = useAuth()
    const queryClient = useQueryClient()

    const updateMutation = useMutation({
        mutationFn: (payload: UpdatePatientPayload) => patientService.update(id!, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(id!) })
            setIsEditModalOpen(false)
            showToast('success', 'Patient profile updated successfully')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: () => patientService.remove(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
            showToast('success', 'Patient deleted successfully')
            navigate('/')
        },
    })

    const handleSymptomSubmit = (data: SymptomFormValues) => {
        createSymptom.mutate(
            {
                symptomType: data.symptomType,
                severity: data.severity,
                occurredAt: new Date(data.occurredAt).toISOString(),
                notes: data.notes || undefined,
            },
            {
                onSuccess: () => {
                    setIsSymptomModalOpen(false)
                    showToast('success', 'Symptom entry logged successfully')
                },
            }
        )
    }

    const handleEditSubmit = (data: PatientFormValues) => {
        updateMutation.mutate(data)
    }

    if (isLoading) {
        return (
            <div className="py-20">
                <Spinner size="lg" label="Loading patient dashboard..." />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="py-8">
                <AlertBanner
                    type="error"
                    message={error instanceof Error ? error.message : 'Failed to load patient'}
                    onRetry={() => refetch()}
                />
            </div>
        )
    }

    if (!patient) return null

    return (
        <DashboardLayout>
            {/* Patient Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <PatientHeader patient={patient} />
                <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                    {isClinician && (
                        <>
                            <Button
                                onClick={() => setIsEditModalOpen(true)}
                                variant="secondary"
                                title="Edit Profile"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </Button>
                            <button
                                onClick={() => setIsDeleteConfirmOpen(true)}
                                title="Delete Patient"
                                className="inline-flex items-center justify-center p-2 rounded-lg
                                    bg-red-50/60 text-red-400 border border-red-200/40
                                    backdrop-blur-sm hover:bg-red-100/80 hover:text-red-600
                                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300/40 focus:ring-offset-1"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </>
                    )}
                    <Button onClick={() => setIsSymptomModalOpen(true)}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Log Symptom
                    </Button>
                </div>
            </div>

            {/* Insights Panel */}
            <InsightsPanel patientId={id!} />

            {/* Severity Chart */}
            <SeverityChart patientId={id!} />

            {/* Symptom History Table */}
            <SymptomTable patientId={id!} />

            {/* Log Symptom Modal */}
            <Modal isOpen={isSymptomModalOpen} onClose={() => setIsSymptomModalOpen(false)} title="Log Symptom Entry">
                <SymptomForm
                    onSubmit={handleSymptomSubmit}
                    isLoading={createSymptom.isPending}
                    error={createSymptom.error instanceof Error ? createSymptom.error.message : null}
                />
            </Modal>

            {/* Edit Patient Modal — Clinician only */}
            {isClinician && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Patient Profile">
                    <PatientForm
                        onSubmit={handleEditSubmit}
                        isLoading={updateMutation.isPending}
                        defaultValues={{
                            firstName: patient.firstName,
                            lastName: patient.lastName,
                            middleName: patient.middleName || '',
                            dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
                            sex: patient.sex,
                            phone: patient.phone,
                            email: patient.email || '',
                            country: patient.country,
                            city: patient.city,
                        }}
                        submitLabel="Save Changes"
                    />
                </Modal>
            )}

            {/* Delete Patient Confirmation — Clinician only */}
            {isClinician && (
                <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Delete Patient">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete <strong>{patient.fullName}</strong>? This will permanently remove all their data including symptom history and cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteMutation.mutate()}
                                isLoading={deleteMutation.isPending}
                            >
                                Delete Patient
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </DashboardLayout>
    )
}