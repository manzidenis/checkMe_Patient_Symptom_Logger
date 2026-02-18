import { useState } from 'react'
import Badge, { severityToBadgeVariant } from '../../ui/Badge'
import { formatSymptomType } from '../../../utils/formatters'
import { getSeverityLabel } from '../../../utils/severityUtils'
import { formatDateTime } from '../../../utils/date'
import type { Symptom } from '../../../types/symptom.types'

interface SymptomTableRowProps {
    symptom: Symptom
    onEdit: (symptom: Symptom) => void
    onDelete: (symptom: Symptom) => void
}

export default function SymptomTableRow({ symptom, onEdit, onDelete }: SymptomTableRowProps) {
    const [showConfirm, setShowConfirm] = useState(false)

    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                {formatSymptomType(symptom.symptomType)}
            </td>
            <td className="px-4 py-3">
                <Badge variant={severityToBadgeVariant(symptom.severity)}>
                    {symptom.severity} — {getSeverityLabel(symptom.severity)}
                </Badge>
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">
                {formatDateTime(symptom.occurredAt)}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate hidden lg:table-cell">
                {symptom.notes || '—'}
            </td>
            <td className="px-4 py-3">
                {showConfirm ? (
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-red-600 font-medium mr-1">Delete?</span>
                        <button
                            onClick={() => { onDelete(symptom); setShowConfirm(false) }}
                            className="p-1 rounded text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                            title="Confirm delete"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="p-1 rounded text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            title="Cancel"
                        >
                            No
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        {/* Edit */}
                        <button
                            onClick={() => onEdit(symptom)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit symptom"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        {/* Delete */}
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete symptom"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                )}
            </td>
        </tr>
    )
}