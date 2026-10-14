import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import App from './App'
import ProtectedRoute from './components/ProtectedRoute'
import { LoginForm } from './components/login-form'
import { SignUpForm } from './components/sign-up-form'
import { ForgotPasswordForm } from './components/forgot-password-form'
import { UpdatePasswordForm } from './components/update-password-form'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota para o hero protegida */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }/>

        {/* rota de login */}
        <Route
          path="/login"
          element={
            <div className="flex min-h-screen items-center justify-center bg-[#161515] p-4 text-white">
              <div className="w-full max-w-sm">
                <LoginForm />
              </div>
            </div>
          }/>

        {/* rota sign */}
        <Route
          path="/sign-up"
          element={
            <div className="flex min-h-screen items-center justify-center bg-[#161515] p-4 text-white">
              <div className="w-full max-w-sm">
                <SignUpForm />
              </div>
            </div>
          }/>

          {/* Rota recuperação snha */}
          <Route
            path="/forgot-password"
            element={
              <div className="flex min-h-screen items-center justify-center bg-[#161515] p-4 text-white">
                <div className="w-full max-w-sm">
                  <ForgotPasswordForm />
                </div>
              </div>
            }
          />
          {/* Rota nova senha */}
          <Route
            path="/update-password"
            element={
              <div className="flex min-h-screen items-center justify-center bg-[#161515] p-4 text-white">
                <div className="w-full max-w-sm">
                  <UpdatePasswordForm />
                </div>
              </div>
            }
          />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)