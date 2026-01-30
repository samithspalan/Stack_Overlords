import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import FarmerDashboard from './pages/FarmerDashboard'
import AboutPage from './pages/AboutPage'
import FarmerLogin from './pages/FarmerLogin'
import AdminLogin from './pages/AdminLogin'
import CustomerLogin from './pages/CustomerLogin'
import FarmerSignup from './pages/FarmerSignup'
import AdminSignup from './pages/AdminSignup'
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

  return (
    <div>
      {currentPage === 'farmer-dashboard' ? (
        <FarmerDashboard />
      ) : currentPage === 'about' ? (
        <AboutPage />
      ) : currentPage === 'farmer-login' ? (
        <FarmerLogin />
      ) : currentPage === 'admin-login' ? (
        <AdminLogin />
      ) : currentPage === 'customer-login' ? (
        <CustomerLogin />
      ) : currentPage === 'farmer-signup' ? (
        <FarmerSignup />
      ) : currentPage === 'admin-signup' ? (
        <AdminSignup />
      ) : currentPage === 'customer-signup' ? (
        <CustomerSignup />
      ) : (
        <HomePage />
      )}
    </div>
  )
}

export default App
