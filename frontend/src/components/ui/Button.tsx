import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Spinner from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    children: ReactNode
    isLoading?: boolean
}

const variantClasses = {
    primary: 'bg-primary text-white hover:bg-blue-700 focus:ring-primary/30',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200',
    danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger/30',
}

const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    isLoading,
    className = '',
    disabled,
    ...rest
}: ButtonProps) {
    return (
        <button
            className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading && <Spinner size="sm" />}
            {children}
        </button>
    )
}