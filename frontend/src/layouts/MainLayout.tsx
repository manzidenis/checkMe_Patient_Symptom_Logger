import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function MainLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-xl shadow-sm shadow-primary/20">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight">CheckMe</span>
                    </div>

                    {/* User info + logout */}
                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-sm">
                                <span className="text-gray-500">{user.email}</span>
                                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider
                  ${user.role === 'CLINICIAN'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'bg-green-50 text-green-700 border border-green-200'
                                    }
                `}>
                                    {user.role}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-gray-400">
                    © 2026 CheckMe — Patient Symptom Logger
                </div>
            </footer>
        </div>
    )
}