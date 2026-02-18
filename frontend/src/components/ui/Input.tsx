import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', id, ...rest }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className={className}>
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-3 py-2 rounded-lg border text-sm transition-colors
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error
                            ? 'border-danger focus:ring-danger/30'
                            : 'border-gray-200 focus:border-primary focus:ring-primary/30'
                        }
          `}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...rest}
                />
                {error && (
                    <p id={`${inputId}-error`} className="mt-1 text-xs text-danger" role="alert">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-xs text-gray-400">{helperText}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
export default Input