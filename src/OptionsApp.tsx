import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import LoginSuccess from '@/pages/auth/LoginSuccess'
import OptionsSettings from '@/pages/OptionsSettings'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function OptionsApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <OptionsSettings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
