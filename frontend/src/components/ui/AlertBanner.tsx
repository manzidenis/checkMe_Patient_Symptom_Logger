// Alert banner component

interface AlertBannerProps {
    type: 'error' | 'warning' | 'success' | 'info'
    message: string
    onDismiss?: () => void
    onRetry?: () => void
    className?: string
}

const typeConfig = {
    error: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
        iconColor: 'text-red-500',
    },
    warning: {
        bg: 'bg-amber-50 border-amber-200',
        text: 'text-amber-800',
        icon: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z',
        iconColor: 'text-amber-500',
    },
    success: {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
        iconColor: 'text-green-500',
    },
    info: {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        icon: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z',
        iconColor: 'text-blue-500',
    },
}

export default function AlertBanner({ type, message, onDismiss, onRetry, className = '' }: AlertBannerProps) {
    const config = typeConfig[type]

    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${config.bg} ${className}`} role="alert">
            <svg className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
            </svg>

            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${config.text}`}>{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className={`mt-2 text-xs font-medium underline underline-offset-2 hover:no-underline ${config.text}`}
                    >
                        Try again
                    </button>
                )}
            </div>

            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className={`flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors ${config.text}`}
                    aria-label="Dismiss"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    )
}