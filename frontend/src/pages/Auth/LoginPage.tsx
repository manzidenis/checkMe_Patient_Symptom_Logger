import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import AlertBanner from '../../components/ui/AlertBanner'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await login({ email, password })
            // Route based on role
            if (response.user.role === 'PATIENT' && response.user.patientId) {
                navigate(`/patients/${response.user.patientId}`, { replace: true })
            } else {
                navigate('/', { replace: true })
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-4">
                        <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">CheckMe</h1>
                    <p className="text-sm text-gray-500 mt-1">Patient Symptom Logger</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1 text-center">Welcome back</h2>
                    <p className="text-sm text-gray-500 mb-6 text-center">Sign in to your account</p>

                    {error && (
                        <div className="mb-4">
                            <AlertBanner type="error" message={error} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            Sign in
                        </Button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Demo Accounts</p>
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => { setEmail('clinician@checkme.rw'); setPassword('clinician123') }}
                                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-colors text-xs"
                            >
                                <span className="font-medium text-gray-700">Clinician</span>
                                <span className="text-gray-400 ml-2">clinician@checkme.rw</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('jane@patient.rw'); setPassword('jane123') }}
                                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-colors text-xs"
                            >
                                <span className="font-medium text-gray-700">Patient (Jane)</span>
                                <span className="text-gray-400 ml-2">jane@patient.rw</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('john@patient.rw'); setPassword('john123') }}
                                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-colors text-xs"
                            >
                                <span className="font-medium text-gray-700">Patient (John)</span>
                                <span className="text-gray-400 ml-2">john@patient.rw</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
