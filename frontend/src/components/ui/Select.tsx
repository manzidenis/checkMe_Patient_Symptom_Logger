import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectOption {
    value: string
    label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label: string
    options: SelectOption[]
    error?: string
    placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, placeholder, className = '', id, ...rest }, ref) => {
        const selectId = id || label.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className={className}>
                {label && (
                    <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={`
            w-full px-3 py-2 rounded-lg border text-sm transition-colors appearance-none
            bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMS41TDYgNi41TDExIDEuNSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error
                            ? 'border-danger focus:ring-danger/30'
                            : 'border-gray-200 focus:border-primary focus:ring-primary/30'
                        }
          `}
                    aria-invalid={!!error}
                    {...rest}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-xs text-danger" role="alert">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

Select.displayName = 'Select'
export default Select