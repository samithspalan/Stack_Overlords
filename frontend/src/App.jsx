import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { authService } from './services/authService'
import HomePage from './pages/HomePage'
import FarmerDashboard from './pages/FarmerDashboard'
import MarketAnalysis from './pages/MarketAnalysis'
import AboutPage from './pages/AboutPage'
import FarmerLogin from './pages/FarmerLogin'
import CustomerLogin from './pages/CustomerLogin'
import FarmerSignup from './pages/FarmerSignup'
import CustomerSignup from './pages/CustomerSignup'

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.hash.slice(1) || 'home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser()
        if (response.user) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      
      // Check if trying to access protected routes
      if ((hash === 'farmer-dashboard' || hash === 'market-analysis') && !isAuthenticated && !loading) {
        setCurrentPage('farmer-login')
        window.location.hash = 'farmer-login'
      } else {
        setCurrentPage(hash || 'home')
      }
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [isAuthenticated, loading])

  const handleNavigate = (page) => {
    // Check if trying to navigate to protected routes
    if ((page === 'farmer-dashboard' || page === 'market-analysis') && !isAuthenticated) {
      window.location.hash = 'farmer-login'
      setCurrentPage('farmer-login')
      return
    }
    
    window.location.hash = page
    setCurrentPage(page)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setIsAuthenticated(false)
      window.location.hash = 'home'
      setCurrentPage('home')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    window.location.hash = 'farmer-dashboard'
    setCurrentPage('farmer-dashboard')
  }

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div>
        {currentPage === 'farmer-dashboard' ? (
          isAuthenticated ? (
            <FarmerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
          ) : (
            <FarmerLogin onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
          )
        ) : currentPage === 'market-analysis' ? (
          isAuthenticated ? (
            <MarketAnalysis onBack={() => handleNavigate('farmer-dashboard')} onLogout={handleLogout} />
          ) : (
            <FarmerLogin onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
          )
        ) : currentPage === 'about' ? (
          <AboutPage />
        ) : currentPage === 'farmer-login' ? (
          <FarmerLogin onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        ) : currentPage === 'customer-login' ? (
          <CustomerLogin />
        ) : currentPage === 'farmer-signup' ? (
          <FarmerSignup onNavigate={handleNavigate} onSignupSuccess={() => handleNavigate('farmer-login')} />
        ) : currentPage === 'customer-signup' ? (
          <CustomerSignup />
        ) : (
          <HomePage />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
