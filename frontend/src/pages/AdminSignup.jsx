import { Sprout, Mail, Lock, User, Shield } from 'lucide-react'
import { useState } from 'react'
import BorderAnimatedContainer from '../../components/BorderAnimatedContainer'

export default function AdminSignup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleSignup = (e) => {
    e.preventDefault()
    console.log('Admin Signup:', { name, email, password, confirmPassword })
    // Navigate to admin login after signup
    window.location.hash = '#admin-login'
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center py-8">
      {/* Logo - Top left */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2">
        <Sprout className="w-8 h-8 text-emerald-600" />
        <h2 className="text-2xl font-bold text-emerald-700">KisanSetu</h2>
      </div>

      {/* Back Button */}
      <a 
        href="#home"
        className="fixed top-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
      >
        ← Back
      </a>

      {/* Signup Container */}
      <div className="w-full max-w-md px-4">
        <BorderAnimatedContainer>
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-6 w-full">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Signup</h1>
              <p className="text-sm text-gray-600">Request admin access</p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-3">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-emerald-600" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-emerald-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-emerald-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

             

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-1 border-emerald-300 rounded" 
                />
                <label className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Terms & Conditions
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg"
              >
                Request Admin Access
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have access?{' '}
                <a href="#admin-login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}
