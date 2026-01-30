import { Sprout, Mail, Lock, Sun, Moon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'
import BorderAnimatedContainer from '../../components/BorderAnimatedContainer'

export default function FarmerLogin() {
  const { isDark, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const googleButtonRef = useRef(null)

  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/google', {
        token: response.credential
      })
      
      console.log('Google Login Success:', res.data)
      // Navigate to dashboard after success
      window.location.hash = '#farmer-dashboard'
    } catch (error) {
      console.error('Google Login Error:', error)
    }
  }

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "952084918159-7rumtd7e8ublui9pphgum4rtp4uo87o8.apps.googleusercontent.com",
        callback: handleGoogleLogin
      })
      
      google.accounts.id.renderButton(
        googleButtonRef.current,
        { theme: "outline", size: "large", width: "100%", text: "continue_with" } 
      )
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    console.log('Farmer Login:', { email, password })
    // Navigate to farmer dashboard
    window.location.hash = '#farmer-dashboard'
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900' 
        : 'bg-linear-to-br from-green-50 via-white to-green-50'
    }`}>
      {/* Logo - Top left */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2">
        <Sprout className="w-8 h-8 text-green-600" />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>KisanSetu</h2>
      </div>

      {/* Back Button & Theme Toggle */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-300 ${
            isDark
              ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <a 
          href="#home"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
        >
          ← Back
        </a>
      </div>

      {/* Login Container */}
      <div className="w-full max-w-md px-4">
        <BorderAnimatedContainer>
          <div className={`rounded-3xl shadow-2xl border p-10 w-full transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-green-100'
          }`}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Farmer Login</h1>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Access your farm dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400'
                      : 'border-green-200 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 border-green-300 rounded" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg"
            >
              Login as Farmer
            </button>

            <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
               <hr className="border-green-100" />
               <p className="text-center text-sm font-medium text-gray-500">OR</p>
               <hr className="border-green-100" />
            </div>

            <div ref={googleButtonRef} className="w-full flex justify-center"></div>
          </form>

          {/* Signup Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="#farmer-signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here
              </a>
            </p>
          </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}
