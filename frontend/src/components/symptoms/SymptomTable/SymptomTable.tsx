import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Card from '../../ui/Card'
import Spinner from '../../ui/Spinner'
import AlertBanner from '../../ui/AlertBanner'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import SymptomFiltersBar from './SymptomFilters'
import SymptomTableRow from './SymptomTableRow'
import SymptomForm from '../../forms/SymptomForm/SymptomForm'
import { useSymptomFilters } from './useSymptomFilters'
import { useSymptoms } from '../../../hooks/useSymptoms'
import { symptomService } from '../../../services/symptom.service'
import { QUERY_KEYS } from '../../../constants/queryKeys'
import { useUI } from '../../../context/UIContext'
import type { Symptom, PaginationMeta } from '../../../types/symptom.types'
import type { SymptomFormValues } from '../../forms/SymptomForm/symptomForm.schema'

interface SymptomTableProps {
    patientId: string
}

function PaginationControls({
    meta,
    onPageChange,
}: {
    meta: PaginationMeta
    onPageChange: (page: number) => void
}) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
                Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={meta.page <= 1}
                    onClick={() => onPageChange(meta.page - 1)}
                >
                    Previous
                </Button>
                <span className="text-xs text-gray-500 px-2">
                    Page {meta.page} of {meta.totalPages}
                </span>
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => onPageChange(meta.page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default function SymptomTable({ patientId }: SymptomTableProps) {
    const { filters, updateFilter, resetFilters, setPage } = useSymptomFilters()
    const { data, isLoading, isError, error, refetch } = useSymptoms(patientId, filters)
    const { showToast } = useUI()
    const queryClient = useQueryClient()

    const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null)

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.symptoms(patientId) })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.insights(patientId) })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    }

    const updateMutation = useMutation({
        mutationFn: ({ symptomId, payload }: { symptomId: string; payload: Partial<SymptomFormValues> }) =>
            symptomService.update(patientId, symptomId, {
                ...payload,
                occurredAt: payload.occurredAt ? new Date(payload.occurredAt).toISOString() : undefined,
                notes: payload.notes || undefined,
            }),
        onSuccess: () => {
            invalidateAll()
            setEditingSymptom(null)
            showToast('success', 'Symptom entry updated')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (symptomId: string) => symptomService.remove(patientId, symptomId),
        onSuccess: () => {
            invalidateAll()
            showToast('success', 'Symptom entry deleted')
        },
    })

    const handleEdit = (symptom: Symptom) => {
        setEditingSymptom(symptom)
    }

    const handleDelete = (symptom: Symptom) => {
        deleteMutation.mutate(symptom.id)
    }

    const handleEditSubmit = (formData: SymptomFormValues) => {
        if (!editingSymptom) return
        updateMutation.mutate({ symptomId: editingSymptom.id, payload: formData })
    }

    return (
        <Card padding="sm">
            <div className="px-2 pt-3 pb-2 sm:px-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Symptom History</h2>
                <SymptomFiltersBar filters={filters} onFilterChange={updateFilter} onReset={resetFilters} />
            </div>

            {isLoading && (
                <div className="py-12">
                    <Spinner label="Loading symptoms..." />
                </div>
            )}

            {isError && (
                <div className="p-4">
                    <AlertBanner
                        type="error"
                        message={error instanceof Error ? error.message : 'Failed to load symptoms'}
                        onRetry={() => refetch()}
                    />
                </div>
            )}

            {data && !isLoading && (
                <>
                    {data.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <svg className="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                            </svg>
                            <p className="text-sm text-gray-500">No symptom entries found</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or log a new symptom</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px]">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Notes</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((symptom) => (
                                        <SymptomTableRow
                                            key={symptom.id}
                                            symptom={symptom}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {data.meta.totalPages > 1 && (
                        <div className="px-4 pb-3">
                            <PaginationControls meta={data.meta} onPageChange={setPage} />
                        </div>
                    )}
                </>
            )}

            {/* Edit Symptom Modal */}
            <Modal
                isOpen={!!editingSymptom}
                onClose={() => setEditingSymptom(null)}
                title="Edit Symptom Entry"
            >
                {editingSymptom && (
                    <SymptomForm
                        onSubmit={handleEditSubmit}
                        isLoading={updateMutation.isPending}
                        defaultValues={{
                            symptomType: editingSymptom.symptomType,
                            severity: editingSymptom.severity,
                            occurredAt: editingSymptom.occurredAt.split('T')[0],
                            notes: editingSymptom.notes || '',
                        }}
                        submitLabel="Save Changes"
                    />
                )}
            </Modal>
        </Card>
    )
}