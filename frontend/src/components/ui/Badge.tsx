import type { ReactNode } from 'react'

type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'gray'

interface BadgeProps {
    children: ReactNode
    variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
}

export default function Badge({ children, variant = 'gray' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]}`}
        >
            {children}
        </span>
    )
}

export function severityToBadgeVariant(severity: number): BadgeVariant {
    if (severity <= 2) return 'green'
    if (severity === 3) return 'yellow'
    return 'red'
}