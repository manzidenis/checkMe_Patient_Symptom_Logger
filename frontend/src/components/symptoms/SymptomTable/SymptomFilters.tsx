import { SYMPTOM_TYPE_OPTIONS } from '../../../constants/symptomTypes'
import Select from '../../ui/Select'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import type { SymptomFilters } from '../../../types/symptom.types'

interface SymptomFiltersProps {
    filters: SymptomFilters
    onFilterChange: (key: keyof SymptomFilters, value: string | number | undefined) => void
    onReset: () => void
}

const SEVERITY_OPTIONS = [
    { value: '1', label: '1 — Mild' },
    { value: '2', label: '2 — Low' },
    { value: '3', label: '3 — Moderate' },
    { value: '4', label: '4 — High' },
    { value: '5', label: '5 — Severe' },
]

export default function SymptomFiltersBar({ filters, onFilterChange, onReset }: SymptomFiltersProps) {
    const hasActiveFilters = !!(filters.symptomType || filters.severity || filters.from || filters.to)

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Select
                    label="Symptom Type"
                    options={SYMPTOM_TYPE_OPTIONS}
                    placeholder="All types"
                    value={filters.symptomType || ''}
                    onChange={(e) => onFilterChange('symptomType', e.target.value || undefined)}
                />

                <Select
                    label="Severity"
                    options={SEVERITY_OPTIONS}
                    placeholder="All levels"
                    value={filters.severity?.toString() || ''}
                    onChange={(e) => onFilterChange('severity', e.target.value ? Number(e.target.value) : undefined)}
                />

                <Input
                    label="From Date"
                    type="date"
                    value={filters.from || ''}
                    onChange={(e) => onFilterChange('from', e.target.value || undefined)}
                />

                <Input
                    label="To Date"
                    type="date"
                    value={filters.to || ''}
                    onChange={(e) => onFilterChange('to', e.target.value || undefined)}
                />
            </div>

            {hasActiveFilters && (
                <div className="flex justify-end">
                    <Button variant="secondary" size="sm" onClick={onReset}>
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    )
}