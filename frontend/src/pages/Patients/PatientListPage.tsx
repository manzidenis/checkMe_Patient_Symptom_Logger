import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePatients } from '../../hooks/usePatients'
import { patientService } from '../../services/patient.service'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import AlertBanner from '../../components/ui/AlertBanner'
import PatientForm from '../../components/forms/PatientForm/PatientForm'
import type { PatientFormValues } from '../../components/forms/PatientForm/patientForm.schema'
import type { Patient, PatientFilters, PaginationMeta } from '../../types/patient.types'
import type { InsightsResponse, SeverityTrend } from '../../types/insights.types'
import { formatSymptomType } from '../../utils/formatters'
import { useUI } from '../../context/UIContext'
import { useQuery } from '@tanstack/react-query'
import { symptomService } from '../../services/symptom.service'
import { QUERY_KEYS } from '../../constants/queryKeys'
import { SYMPTOM_TYPE_OPTIONS } from '../../constants/symptomTypes'

/* ─── Types for insight-based filters ─── */
interface InsightFilters {
    alertStatus: '' | 'alert' | 'normal'
    severityTrend: '' | SeverityTrend
    topSymptom: string
    minEntries: string
    maxEntries: string
}

const DEFAULT_INSIGHT_FILTERS: InsightFilters = {
    alertStatus: '',
    severityTrend: '',
    topSymptom: '',
    minEntries: '',
    maxEntries: '',
}

/* ─── Trend badge styling ─── */
const trendConfig: Record<string, { label: string; color: string; icon: string }> = {
    worsening: { label: 'Worsening', color: 'text-red-600 bg-red-50', icon: '↑' },
    improving: { label: 'Improving', color: 'text-green-600 bg-green-50', icon: '↓' },
    stable: { label: 'Stable', color: 'text-blue-600 bg-blue-50', icon: '→' },
    insufficient_data: { label: 'Low data', color: 'text-gray-500 bg-gray-50', icon: '—' },
    no_data: { label: 'No data', color: 'text-gray-400 bg-gray-50', icon: '—' },
}

/* ─── Per-patient insights hook ─── */
function usePatientInsights(patientId: string) {
    return useQuery<InsightsResponse>({
        queryKey: QUERY_KEYS.patients.insights(patientId),
        queryFn: () => symptomService.getInsights(patientId),
        staleTime: 60_000,
    })
}

/* ─── Check if a patient's insights match insight filters ─── */
function matchesInsightFilters(
    insights: InsightsResponse | undefined,
    insightFilters: InsightFilters,
    symptomCount: number,
): boolean {
    // If no insight filters are active, always match
    const hasAnyFilter =
        insightFilters.alertStatus !== '' ||
        insightFilters.severityTrend !== '' ||
        insightFilters.topSymptom !== '' ||
        insightFilters.minEntries !== '' ||
        insightFilters.maxEntries !== ''

    if (!hasAnyFilter) return true

    // Entries count filter (from patient data, no insights needed)
    if (insightFilters.minEntries !== '') {
        const min = parseInt(insightFilters.minEntries, 10)
        if (!isNaN(min) && symptomCount < min) return false
    }
    if (insightFilters.maxEntries !== '') {
        const max = parseInt(insightFilters.maxEntries, 10)
        if (!isNaN(max) && symptomCount > max) return false
    }

    // For the remaining filters we need insights loaded
    if (!insights) return true // show while loading, hide after

    if (insightFilters.alertStatus === 'alert' && !insights.alert) return false
    if (insightFilters.alertStatus === 'normal' && insights.alert) return false

    if (insightFilters.severityTrend !== '' && insights.severityTrend !== insightFilters.severityTrend) return false

    if (insightFilters.topSymptom !== '' && insights.topSymptom !== insightFilters.topSymptom) return false

    return true
}

/* ─── Sortable table header ─── */
function SortableHeader({
    label,
    field,
    currentSort,
    currentOrder,
    onSort,
    className = '',
}: {
    label: string
    field: string
    currentSort: string
    currentOrder: 'asc' | 'desc'
    onSort: (field: string) => void
    className?: string
}) {
    const isActive = currentSort === field
    return (
        <th
            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none ${className}`}
            onClick={() => onSort(field)}
        >
            <span className="inline-flex items-center gap-1">
                {label}
                {isActive && (
                    <span className="text-primary text-[10px]">{currentOrder === 'asc' ? '▲' : '▼'}</span>
                )}
            </span>
        </th>
    )
}

/* ─── Insights row (with insight filter awareness) ─── */
function InsightsRow({
    patient,
    insightFilters,
}: {
    patient: Patient
    insightFilters: InsightFilters
}) {
    const navigate = useNavigate()
    const { data: insights, isLoading } = usePatientInsights(patient.id)
    const trend = insights ? trendConfig[insights.severityTrend] || trendConfig.no_data : null

    // Apply insight-based filters once insights are loaded
    const visible = isLoading
        ? matchesInsightFilters(undefined, insightFilters, patient.symptomCount)
        : matchesInsightFilters(insights, insightFilters, patient.symptomCount)

    if (!visible) return null

    return (
        <tr
            onClick={() => navigate(`/patients/${patient.id}`)}
            className="group cursor-pointer hover:bg-blue-50/40 transition-colors"
        >
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                            {patient.fullName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {patient.city}, {patient.country}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3.5 text-center">
                {isLoading ? (
                    <span className="inline-block w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
                ) : insights?.alert ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50/80 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Alert
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50/80 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Normal
                    </span>
                )}
            </td>

            <td className="px-4 py-3.5 hidden sm:table-cell">
                {isLoading ? (
                    <span className="inline-block w-16 h-4 rounded bg-gray-100 animate-pulse" />
                ) : trend ? (
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trend.color}`}>
                        <span>{trend.icon}</span>
                        {trend.label}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">—</span>
                )}
            </td>

            <td className="px-4 py-3.5 hidden md:table-cell">
                {isLoading ? (
                    <span className="inline-block w-20 h-4 rounded bg-gray-100 animate-pulse" />
                ) : insights?.topSymptom ? (
                    <span className="text-sm text-gray-700">
                        {formatSymptomType(insights.topSymptom)}
                        <span className="text-xs text-gray-400 ml-1">({insights.topSymptomCount})</span>
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">—</span>
                )}
            </td>

            <td className="px-4 py-3.5 text-center">
                <span className="text-sm font-medium text-gray-700">{patient.symptomCount}</span>
            </td>
        </tr>
    )
}

/* ─── Pagination Controls ─── */
function PaginationControls({
    meta,
    onPageChange,
}: {
    meta: PaginationMeta
    onPageChange: (page: number) => void
}) {
    if (meta.totalPages <= 1) return null

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
                Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} patients
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

/* ─── Sort options for select ─── */
const SORT_OPTIONS = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'firstName:asc', label: 'Name (A–Z)' },
    { value: 'firstName:desc', label: 'Name (Z–A)' },
    { value: 'city:asc', label: 'City (A–Z)' },
    { value: 'country:asc', label: 'Country (A–Z)' },
    { value: 'symptomCount:desc', label: 'Most Entries' },
    { value: 'symptomCount:asc', label: 'Fewest Entries' },
]

const SEX_OPTIONS = [
    { value: '', label: 'All Genders' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
]

const ALERT_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'alert', label: '🔴 Alert' },
    { value: 'normal', label: '🟢 Normal' },
]

const TREND_OPTIONS = [
    { value: '', label: 'All Trends' },
    { value: 'worsening', label: '↑ Worsening' },
    { value: 'improving', label: '↓ Improving' },
    { value: 'stable', label: '→ Stable' },
    { value: 'insufficient_data', label: '— Low Data' },
    { value: 'no_data', label: '— No Data' },
]

const PAGE_SIZE = 8

/* ─── Shared select classes ─── */
const selectClasses = `px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white/80
    backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20
    focus:border-primary/40 transition-all text-gray-700`

const inputClasses = `px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white/80
    backdrop-blur-sm placeholder:text-gray-400 focus:outline-none focus:ring-2
    focus:ring-primary/20 focus:border-primary/40 transition-all`

/* ─── Main page ─── */
export default function PatientListPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filters, setFilters] = useState<PatientFilters>({
        page: 1,
        limit: PAGE_SIZE,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    })
    const [insightFilters, setInsightFilters] = useState<InsightFilters>(DEFAULT_INSIGHT_FILTERS)

    const { data: response, isLoading, isError, error, refetch } = usePatients(filters)
    const { showToast } = useUI()
    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: patientService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
            setIsModalOpen(false)
            showToast('success', 'Patient registered successfully')
        },
    })

    const updateFilter = useCallback((key: keyof PatientFilters, value: string | number) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: key === 'page' ? Number(value) : 1,
        }))
    }, [])

    const handleSortChange = useCallback((value: string) => {
        const [sortBy, sortOrder] = value.split(':') as [string, 'asc' | 'desc']
        setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }))
    }, [])

    const handleColumnSort = useCallback((field: string) => {
        setFilters((prev) => ({
            ...prev,
            sortBy: field,
            sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
            page: 1,
        }))
    }, [])

    const updateInsightFilter = useCallback(<K extends keyof InsightFilters>(key: K, value: InsightFilters[K]) => {
        setInsightFilters((prev) => ({ ...prev, [key]: value }))
    }, [])

    const hasInsightFilters = useMemo(() => {
        return Object.values(insightFilters).some((v) => v !== '')
    }, [insightFilters])

    const clearInsightFilters = useCallback(() => {
        setInsightFilters(DEFAULT_INSIGHT_FILTERS)
    }, [])

    const patients = response?.data ?? []
    const meta = response?.meta

    return (
        <div className="space-y-5">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patients</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {meta ? `${meta.total} registered patient${meta.total !== 1 ? 's' : ''}` : 'Loading...'}
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Register Patient
                </Button>
            </div>

            {/* ──── Search + Patient Filters (server-side) ──── */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, phone, city..."
                        value={filters.search ?? ''}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        className={`w-full pl-10 pr-4 ${inputClasses}`}
                    />
                </div>

                {/* Filter: Sex */}
                <select
                    value={filters.sex ?? ''}
                    onChange={(e) => updateFilter('sex', e.target.value)}
                    className={selectClasses}
                >
                    {SEX_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                {/* Sort */}
                <select
                    value={`${filters.sortBy}:${filters.sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className={selectClasses}
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* ──── Insight Filters (client-side on visible page) ──── */}
            <div className="bg-gradient-to-r from-indigo-50/60 to-purple-50/40 border border-indigo-100/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                        Insight Filters
                    </h3>
                    {hasInsightFilters && (
                        <button
                            onClick={clearInsightFilters}
                            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {/* Alert Status */}
                    <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Alert Status</label>
                        <select
                            value={insightFilters.alertStatus}
                            onChange={(e) => updateInsightFilter('alertStatus', e.target.value as InsightFilters['alertStatus'])}
                            className={`w-full ${selectClasses}`}
                        >
                            {ALERT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Severity Trend */}
                    <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Severity Trend</label>
                        <select
                            value={insightFilters.severityTrend}
                            onChange={(e) => updateInsightFilter('severityTrend', e.target.value as InsightFilters['severityTrend'])}
                            className={`w-full ${selectClasses}`}
                        >
                            {TREND_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Top Symptom */}
                    <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Top Symptom</label>
                        <select
                            value={insightFilters.topSymptom}
                            onChange={(e) => updateInsightFilter('topSymptom', e.target.value)}
                            className={`w-full ${selectClasses}`}
                        >
                            <option value="">All Symptoms</option>
                            {SYMPTOM_TYPE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Min Entries */}
                    <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Min Entries</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={insightFilters.minEntries}
                            onChange={(e) => updateInsightFilter('minEntries', e.target.value)}
                            className={`w-full ${inputClasses}`}
                        />
                    </div>

                    {/* Max Entries */}
                    <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Max Entries</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="∞"
                            value={insightFilters.maxEntries}
                            onChange={(e) => updateInsightFilter('maxEntries', e.target.value)}
                            className={`w-full ${inputClasses}`}
                        />
                    </div>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="py-16">
                    <Spinner size="lg" label="Loading patients..." />
                </div>
            )}

            {/* Error */}
            {isError && (
                <AlertBanner
                    type="error"
                    message={error instanceof Error ? error.message : 'Failed to load patients'}
                    onRetry={() => refetch()}
                />
            )}

            {/* Table */}
            {!isLoading && !isError && (
                <>
                    {patients.length === 0 ? (
                        <div className="py-16 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <p className="text-base font-medium text-gray-600">
                                {filters.search ? 'No patients match your search' : 'No patients registered yet'}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                {filters.search ? 'Try a different search term' : 'Click "Register Patient" to get started'}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100/60 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-gray-100/80">
                                            <SortableHeader
                                                label="Patient"
                                                field="firstName"
                                                currentSort={filters.sortBy ?? 'createdAt'}
                                                currentOrder={filters.sortOrder ?? 'desc'}
                                                onSort={handleColumnSort}
                                            />
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Severity Trend</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Top Symptom (30D)</th>
                                            <SortableHeader
                                                label="Entries"
                                                field="symptomCount"
                                                currentSort={filters.sortBy ?? 'createdAt'}
                                                currentOrder={filters.sortOrder ?? 'desc'}
                                                onSort={handleColumnSort}
                                                className="text-center"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {patients.map((patient) => (
                                            <InsightsRow
                                                key={patient.id}
                                                patient={patient}
                                                insightFilters={insightFilters}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {meta && (
                                <PaginationControls
                                    meta={meta}
                                    onPageChange={(page) => updateFilter('page', page)}
                                />
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Register Patient Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Patient">
                <PatientForm
                    onSubmit={(data: PatientFormValues) => createMutation.mutate(data)}
                    isLoading={createMutation.isPending}
                />
            </Modal>
        </div>
    )
}