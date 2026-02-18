import { getSeverityLabel, getSeverityColor } from '../../../utils/severityUtils'

interface SeveritySliderProps {
    value: number
    onChange: (value: number) => void
    error?: string
}

const levels = [1, 2, 3, 4, 5]

export default function SeveritySlider({ value, onChange, error }: SeveritySliderProps) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level
            </label>

            <div className="flex items-center gap-2">
                {levels.map((level) => {
                    const isActive = level === value
                    const color = getSeverityColor(level)

                    return (
                        <button
                            key={level}
                            type="button"
                            onClick={() => onChange(level)}
                            className={`
                flex-1 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 border-2
                focus:outline-none focus:ring-2 focus:ring-offset-1
                ${isActive
                                    ? 'text-white shadow-sm scale-105'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }
              `}
                            style={isActive ? { backgroundColor: color, borderColor: color } : undefined}
                            aria-pressed={isActive}
                            aria-label={`Severity ${level}: ${getSeverityLabel(level)}`}
                        >
                            {level}
                        </button>
                    )
                })}
            </div>

            <div className="flex justify-between mt-1.5 px-1">
                <span className="text-xs text-gray-400">Mild</span>
                <span className="text-xs font-medium" style={{ color: getSeverityColor(value) }}>
                    {getSeverityLabel(value)}
                </span>
                <span className="text-xs text-gray-400">Severe</span>
            </div>

            {error && (
                <p className="mt-1 text-xs text-danger" role="alert">{error}</p>
            )}
        </div>
    )
}