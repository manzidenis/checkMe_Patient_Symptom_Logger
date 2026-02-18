import type { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
}

export default function Card({ children, className = '', padding = 'md' }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${paddingClasses[padding]} ${className}`}>
            {children}
        </div>
    )
}