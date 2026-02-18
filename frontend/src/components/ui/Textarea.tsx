import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', id, ...rest }, ref) => {
        const textareaId = id || label.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className={className}>
                {label && (
                    <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={3}
                    className={`
            w-full px-3 py-2 rounded-lg border text-sm transition-colors resize-y
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error
                            ? 'border-danger focus:ring-danger/30'
                            : 'border-gray-200 focus:border-primary focus:ring-primary/30'
                        }
          `}
                    aria-invalid={!!error}
                    {...rest}
                />
                {error && (
                    <p className="mt-1 text-xs text-danger" role="alert">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'
export default Textarea