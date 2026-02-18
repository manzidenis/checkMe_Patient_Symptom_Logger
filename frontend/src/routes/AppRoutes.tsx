import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/Auth/LoginPage'
import PatientListPage from '../pages/Patients/PatientListPage'
import PatientDashboardPage from '../pages/Patients/PatientDashboardPage'
import NewPatientPage from '../pages/Patients/NewPatientPage'

// Redirects patient users from "/" to their own dashboard
function HomeRedirect() {
  const { isPatient, user } = useAuth()

  if (isPatient && user?.patientId) {
    return <Navigate to={`/patients/${user.patientId}`} replace />
  }

  return <PatientListPage />
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/patients/new" element={<NewPatientPage />} />
            <Route path="/patients/:id" element={<PatientDashboardPage />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
