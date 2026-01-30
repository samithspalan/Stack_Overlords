import { 
  Sprout, 
  Shield, 
  ShoppingCart, 
  Leaf, 
  Users, 
  TrendingUp, 
  Sun,
  Moon,
  ArrowRight,
  HeartHandshake,
  Truck,
  Building2
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function HomePage() {
  const { isDark, toggleTheme } = useTheme()
  const [activeLink, setActiveLink] = useState('home')
  const canvasRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const particles = useRef([])
  const [farmers, setFarmers] = useState(0)
  const [volume, setVolume] = useState(0)
  const [mandis, setMandis] = useState(0)
  const [animateRoles, setAnimateRoles] = useState(false)
  const [rolesAnimationKey, setRolesAnimationKey] = useState(0)
  const rolesSectionRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    particles.current = Array.from({ length: 200}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      opacity: Math.random() * 0.5 + 0.2
    }))

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)'

      particles.current.forEach((particle, index) => {
        // Move towards mouse position (Attraction)
        const dx = mousePos.current.x - particle.x
        const dy = mousePos.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200) {
          particle.x += dx * 0.02
          particle.y += dy * 0.02
        }

        // Movement
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Draw particle
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = '#10b981'
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw lines between nearby particles
        particles.current.forEach((other, otherIndex) => {
          if (index < otherIndex) {
            const distX = particle.x - other.x
            const distY = particle.y - other.y
            const dist = Math.sqrt(distX * distX + distY * distY)

            if (dist < 100) {
              ctx.globalAlpha = (1 - dist / 100) * 0.3
              ctx.strokeStyle = '#10b981'
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
            }
          }
        })
      })

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Counter animation effect
  useEffect(() => {
    const animateCounter = (setter, target, duration = 2000) => {
      const start = 0
      const increment = target / (duration / 16)
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(current))
        }
      }, 16)

      return timer
    }

    const timer1 = animateCounter(setFarmers, 10000, 2000)
    const timer2 = animateCounter(setVolume, 500, 2000)
    const timer3 = animateCounter(setMandis, 120, 2000)

    // Loop animation
    const loopTimer = setInterval(() => {
      setFarmers(0)
      setVolume(0)
      setMandis(0)
      setTimeout(() => {
        animateCounter(setFarmers, 10000, 2000)
        animateCounter(setVolume, 500, 2000)
        animateCounter(setMandis, 120, 2000)
      }, 100)
    }, 4000)

    return () => {
      clearInterval(timer1)
      clearInterval(timer2)
      clearInterval(timer3)
      clearInterval(loopTimer)
    }
  }, [])

  useEffect(() => {
    const element = rolesSectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateRoles(false)
          requestAnimationFrame(() => {
            setRolesAnimationKey((prev) => prev + 1)
            setAnimateRoles(true)
          })
        } else {
          setAnimateRoles(false)
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`min-h-screen relative overflow-hidden font-sans selection:bg-emerald-200 selection:text-emerald-900 transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Background Canvas */}
      <canvas 
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Glassmorphic Navigation */}
      <div className="fixed top-2 left-4 z-50 flex items-center gap-2">
        <Sprout className="w-8 h-8 text-emerald-600" />
        <h2 className="text-2xl font-bold text-emerald-700">KisanSetu</h2>
      </div>

      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-4">
        <div className={`rounded-full px-6 py-2 shadow-lg border transition-colors duration-300 ${
          isDark
            ? 'bg-slate-800/30 backdrop-blur-md border-slate-700/20'
            : 'bg-white/30 backdrop-blur-md border-white/20'
        }`}>
          <div className="flex gap-12 items-center">
            <a 
              href="#home" 
              onClick={() => setActiveLink('home')}
              className={`font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                activeLink === 'home' ? 'bg-green-600 text-white' : isDark ? 'text-slate-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={() => setActiveLink('about')}
              className={`font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                activeLink === 'about' ? 'bg-green-600 text-white' : isDark ? 'text-slate-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              About
            </a>
            <a 
              href="#features" 
              onClick={(e) => {
                e.preventDefault()
                setActiveLink('features')
                const element = document.getElementById('features')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                activeLink === 'features' ? 'bg-green-600 text-white' : isDark ? 'text-slate-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Features
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault()
                setActiveLink('contact')
                const element = document.getElementById('contact')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                activeLink === 'contact' ? 'bg-green-600 text-white' : isDark ? 'text-slate-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Contact
            </a>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-300 ${
            isDark
              ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          } shadow-lg border ${isDark ? 'border-slate-700' : 'border-white/20'}`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         

          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Cultivating a <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-500 to-emerald-600">
              Better Future
            </span>
          </h1>

          <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Directly connecting farmers with modern markets. Fair prices, transparent supply chains, and real-time insights for a thriving agricultural ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
             <button
               onClick={() => {
                 setActiveLink('login')
                 const element = document.getElementById('login-section')
                 element?.scrollIntoView({ behavior: 'smooth' })
               }}
               className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl shadow-emerald-200 hover:shadow-emerald-300 flex items-center gap-2"
             >
               Connect Now
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
             <button
               onClick={() => {
                 setActiveLink('features')
                 const element = document.getElementById('features')
                 element?.scrollIntoView({ behavior: 'smooth' })
               }}
               className="group bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:border-emerald-200 flex items-center gap-2"
             >
               Learn More
             </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { label: 'Active Farmers', value: farmers, suffix: '+', icon: Users, color: 'text-blue-600', bg: isDark ? 'bg-blue-900/30' : 'bg-blue-50' },
              { label: 'Weekly Volume', value: volume, suffix: ' Tons', icon: TrendingUp, color: 'text-emerald-600', bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50' },
              { label: 'Partner Mandis', value: mandis, suffix: '+', icon: Building2, color: 'text-amber-600', bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50' },
            ].map((stat, idx) => (
              <div key={idx} className={`rounded-2xl p-8 border shadow-sm hover:shadow-md transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-slate-100'
              }`}>
                <div className="flex items-center justify-between pointer-events-none">
                  <div className="text-left">
                    <p className={`text-4xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {stat.value.toLocaleString()}{stat.suffix}
                    </p>
                    <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bg}`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 z-10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>About KisanSetu</h2>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            KisanSetu connects farmers and buyers with transparent pricing, real-time market insights, and
            smarter supply chain decisions—helping growers earn more while delivering fresher produce.
          </p>
        </div>
      </section>

      {/* Login Cards Section */}
      <section
        id="login-section"
        ref={rolesSectionRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10"
      >
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
            Select Your Role
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Choose your account type to get started
          </p>
        </div>

        {/* Login Cards Grid */}
        <div key={rolesAnimationKey} className="grid md:grid-cols-2 gap-10 mb-12 max-w-4xl mx-auto">
          {/* Farmer Card */}
          <a href="#farmer-login" className={`group block ${animateRoles ? 'animate-slide-in-left' : 'opacity-0 -translate-x-8'}`}>
            <div className={`h-full rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="bg-linear-to-br from-green-400 to-green-600 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                <Sprout className="w-16 h-16 text-white relative z-10" strokeWidth={1.5} />
              </div>
              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Farmer Login</h3>
                <p className={`mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Access your farm profile and connect directly with markets
                </p>
                <button className="w-full bg-linear-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                  Login as Farmer
                </button>
              </div>
            </div>
          </a>
            
          {/* Customer Card */}
          <a href="#customer-login" className={`group block ${animateRoles ? 'animate-slide-in-right' : 'opacity-0 translate-x-8'}`}>
            <div className={`h-full rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="bg-linear-to-br from-teal-400 to-teal-600 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                <ShoppingCart className="w-16 h-16 text-white relative z-10" strokeWidth={1.5} />
              </div>
              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Customer Login</h3>
                <p className={`mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Browse and purchase fresh produce directly from farmers
                </p>
                <button className="w-full bg-linear-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                  Login as Customer
                </button>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">Why Choose Us</span>
            <h2 className={`mt-2 text-3xl md:text-4xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Revolutionizing the Supply Chain</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: HeartHandshake, 
                title: "Fair Trade Practices", 
                desc: "We ensure every farmer gets their due worth through our transparent bidding system." 
              },
              { 
                icon: Truck, 
                title: "Smart Logistics", 
                desc: "Integrated logistics support to get produce from farm to fork faster and fresher." 
              },
              { 
                icon: Sun, 
                title: "Weather Insights", 
                desc: "Real-time weather data to help farmers plan their harvest and protect crops." 
              },
              { 
                icon: Shield, 
                title: "Secure Payments", 
                desc: "Escrow-protected payments ensure safety for both buyers and sellers." 
              },
              { 
                icon: TrendingUp, 
                title: "Market Analysis", 
                desc: "Data-driven insights on crop demand and pricing trends." 
              },
              { 
                icon: Sprout, 
                title: "Sustainable Growth", 
                desc: "Promoting eco-friendly farming practices for a better tomorrow." 
              }
            ].map((feature, idx) => (
              <div key={idx} className={`flex gap-4 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border ${
                isDark
                  ? 'hover:bg-slate-800 border-transparent hover:border-slate-700'
                  : 'hover:bg-white border-transparent hover:border-slate-100'
              }`}>
                <div className="shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{feature.title}</h3>
                  <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={`py-16 z-10 relative mt-12 transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-300' : 'bg-[#0f172a] text-slate-300'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-8 h-8 text-emerald-500" />
                <span className="text-2xl font-bold text-white">KisanSetu</span>
              </div>
              <p className={`max-w-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                Bridging the gap between India's hardworking farmers and the modern marketplace. Technology for a greener, wealthier future.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer ${
                    isDark ? 'bg-slate-900' : 'bg-slate-800'
                  }`}>
                    <div className="w-5 h-5 bg-current rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold text-lg mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Find Produce</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Sell Crops</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Market Prices</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Logistics</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
            isDark ? 'border-slate-800' : 'border-slate-800'
          }`}>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>© 2026 KisanSetu. All rights reserved.</p>
            <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Made with <span className="text-red-500">♥</span> for Indian Agriculture
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
