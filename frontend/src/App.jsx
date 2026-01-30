import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
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

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      setCurrentPage(hash || 'home')
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleNavigate = (page) => {
    window.location.hash = page
    setCurrentPage(page)
  }

  return (
    <ThemeProvider>
      <div>
        {currentPage === 'farmer-dashboard' ? (
          <FarmerDashboard onNavigate={handleNavigate} />
        ) : currentPage === 'market-analysis' ? (
          <MarketAnalysis onBack={() => handleNavigate('farmer-dashboard')} />
        ) : currentPage === 'about' ? (
          <AboutPage />
        ) : currentPage === 'farmer-login' ? (
          <FarmerLogin />
        ) : currentPage === 'customer-login' ? (
          <CustomerLogin />
        ) : currentPage === 'farmer-signup' ? (
          <FarmerSignup />
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
