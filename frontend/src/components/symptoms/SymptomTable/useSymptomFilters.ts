import { useState, useCallback } from 'react'
import type { SymptomFilters } from '../../../types/symptom.types'

export function useSymptomFilters() {
    const [filters, setFilters] = useState<SymptomFilters>({
        page: 1,
        limit: 10,
    })

    const updateFilter = useCallback((key: keyof SymptomFilters, value: string | number | undefined) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined,
            page: key !== 'page' ? 1 : (value as number),
        }))
    }, [])

    const resetFilters = useCallback(() => {
        setFilters({ page: 1, limit: 10 })
    }, [])

    const setPage = useCallback((page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }, [])

    return { filters, updateFilter, resetFilters, setPage }
}