import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(dateStr: string): string {
    return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function formatDateTime(dateStr: string): string {
    return format(parseISO(dateStr), 'MMM d, yyyy · h:mm a')
}

export function formatRelative(dateStr: string): string {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
}

export function toInputDate(dateStr?: string): string {
    if (!dateStr) return ''
    return format(parseISO(dateStr), 'yyyy-MM-dd')
}

export function toISODate(inputDate: string): string {
    return new Date(inputDate).toISOString()
}