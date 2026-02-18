import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface Toast {
    id: number
    type: 'success' | 'error' | 'info'
    message: string
}

interface UIContextType {
    toasts: Toast[]
    showToast: (type: Toast['type'], message: string) => void
    dismissToast: (id: number) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

let nextId = 0

export function UIProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((type: Toast['type'], message: string) => {
        const id = nextId++
        setToasts((prev) => [...prev, { id, type, message }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 3500)
    }, [])

    const dismissToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <UIContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}

            {/* Toast container — top-right */}
            {toasts.length > 0 && (
                <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                shadow-md border backdrop-blur-sm
                animate-[toastSlideIn_0.35s_cubic-bezier(0.16,1,0.3,1)]
                ${toast.type === 'success' ? 'bg-green-50/90 text-green-800 border-green-200/60' : ''}
                ${toast.type === 'error' ? 'bg-red-50/90 text-red-800 border-red-200/60' : ''}
                ${toast.type === 'info' ? 'bg-blue-50/90 text-blue-800 border-blue-200/60' : ''}
              `}
                            role="alert"
                        >
                            {/* Icon */}

                            <span className="flex-1">{toast.message}</span>
                            <button
                                onClick={() => dismissToast(toast.id)}
                                className="flex-shrink-0 p-0.5 rounded-md hover:bg-black/5 transition-colors"
                                aria-label="Dismiss"
                            >
                                <svg className="h-3.5 w-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </UIContext.Provider>
    )
}

export function useUI() {
    const context = useContext(UIContext)
    if (!context) throw new Error('useUI must be used within UIProvider')
    return context
}