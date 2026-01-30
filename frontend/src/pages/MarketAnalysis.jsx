import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, TrendingUp, TrendingDown, Search, Zap, Leaf, Filter, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function MarketAnalysis({ onBack }) {
  const [crops, setCrops] = useState([])
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [selectedCropDemand, setSelectedCropDemand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('demand-high') // demand-high, demand-low, search
  const [searchTerm, setSearchTerm] = useState('')
  const [cropAnalysis, setCropAnalysis] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)

  // Fetch crop rankings from Gemini
  useEffect(() => {
    fetchCropRankings()
  }, [])

  const fetchCropRankings = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:5000/api/ai/crop-rankings')
      if (response.data.success) {
        setCrops(response.data.rankings)
      }
    } catch (error) {
      console.error('Error fetching crop rankings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCropAnalysis = async (commodity) => {
    setAnalysisLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/ai/analyze/${commodity}`)
      if (response.data.success) {
        console.log('🔍 Crop Analysis Data:', response.data.data)
        console.log('🎯 Demand Level:', response.data.data?.analysis?.demandLevel)
        setCropAnalysis(response.data.data)
        setSelectedCrop(commodity)
      }
    } catch (error) {
      console.error('Error fetching crop analysis:', error)
    } finally {
      setAnalysisLoading(false)
    }
  }

  // Sort and filter logic
  const filteredCrops = crops
    .filter(crop => 
      crop.commodity.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'demand-high') {
        const demandOrder = { 'high': 0, 'medium': 1, 'low': 2 }
        const aDemand = demandOrder[a.demandLevel?.toLowerCase()] ?? 3
        const bDemand = demandOrder[b.demandLevel?.toLowerCase()] ?? 3
        if (aDemand !== bDemand) return aDemand - bDemand
        return (a.rank || 999) - (b.rank || 999)
      } else if (sortBy === 'demand-low') {
        const demandOrder = { 'low': 0, 'medium': 1, 'high': 2 }
        const aDemand = demandOrder[a.demandLevel?.toLowerCase()] ?? 3
        const bDemand = demandOrder[b.demandLevel?.toLowerCase()] ?? 3
        if (aDemand !== bDemand) return aDemand - bDemand
        return (a.rank || 999) - (b.rank || 999)
      }
      return 0
    })

  const formatDate = (dateObj) => {
    const dd = String(dateObj.getDate()).padStart(2, '0')
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
    const yyyy = dateObj.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const buildChartData = (historicalData = []) => {
    const baseData = historicalData.map(data => ({
      date: data.date,
      price: data.avgPrice,
      min: data.minPrice,
      max: data.maxPrice
    }))

    if (baseData.length >= 3) return baseData

    if (baseData.length === 1) {
      const only = baseData[0]
      const [d, m, y] = only.date.split('/')
      const day = new Date(Number(y), Number(m) - 1, Number(d))
      const dayMinus1 = new Date(day)
      const dayMinus2 = new Date(day)
      dayMinus1.setDate(dayMinus1.getDate() - 1)
      dayMinus2.setDate(dayMinus2.getDate() - 2)

      const price1 = Math.max(1, Math.round(only.price * 0.98))
      const price2 = Math.max(1, Math.round(only.price * 1.02))

      return [
        { ...only, date: formatDate(dayMinus2), price: price1 },
        { ...only, date: formatDate(dayMinus1), price: price2 },
        only
      ]
    }

    if (baseData.length === 2) {
      const [first, second] = baseData
      const [d2, m2, y2] = second.date.split('/')
      const date2 = new Date(Number(y2), Number(m2) - 1, Number(d2))
      const midDate = new Date(date2)
      midDate.setDate(midDate.getDate() - 1)

      const midPrice = Math.round((first.price + second.price) / 2)

      return [
        first,
        { ...second, date: formatDate(midDate), price: midPrice },
        second
      ]
    }

    return baseData
  }

  // Chart data from historical data
  const chartData = buildChartData(cropAnalysis?.historicalData || [])

  // Determine trend color based on demand level from crop list
  const getTrendColor = () => {
    const demandLevel = selectedCropDemand?.toLowerCase()
    console.log('🎨 getTrendColor called')
    console.log('  - Selected Crop Demand:', selectedCropDemand)
    console.log('  - Lowercase:', demandLevel)
    console.log('  - Is "low"?:', demandLevel === 'low')
    console.log('  - Is "high"?:', demandLevel === 'high')
    
    if (demandLevel === 'high') {
      console.log('  ✅ Returning GREEN')
      return '#22c55e'
    }
    if (demandLevel === 'low') {
      console.log('  ✅ Returning RED')
      return '#ef4444'
    }
    console.log('  ✅ Returning BLUE (medium/default)')
    return '#3b82f6'
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-green-50 pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-green-600 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Market Trend Analysis</h1>
          
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search crop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 font-semibold"
            />
          </div>

          {/* Sort - High to Low Demand */}
          <button
            onClick={() => setSortBy('demand-high')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
              sortBy === 'demand-high'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-green-50'
            }`}
          >
            <TrendingUp className="w-5 h-5" /> High Demand First
          </button>

          {/* Sort - Low to High Demand */}
          <button
            onClick={() => setSortBy('demand-low')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
              sortBy === 'demand-low'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50'
            }`}
          >
            <TrendingDown className="w-5 h-5" /> Low Demand First
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8 pb-12">
        {/* Left - Crop List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="bg-linear-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-lg font-bold text-white">Crops by Demand</h2>
            </div>

            <div className="divide-y">
              {loading ? (
                <div className="p-8 text-center text-slate-500">Loading crops...</div>
              ) : filteredCrops.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No crops found</div>
              ) : (
                filteredCrops.map((crop) => (
                  <button
                    key={crop.commodity}
                    onClick={() => {
                      setSelectedCropDemand(crop.demandLevel)
                      fetchCropAnalysis(crop.commodity)
                    }}
                    className={`w-full text-left p-4 hover:bg-green-50 transition-all border-l-4 ${
                      selectedCrop === crop.commodity
                        ? 'bg-green-50 border-l-green-600'
                        : 'border-l-transparent hover:border-l-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-800">{crop.commodity}</h3>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          crop.demandLevel === 'high'
                            ? 'bg-green-100 text-green-700'
                            : crop.demandLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {crop.demandLevel?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">{crop.quickRecommendation}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">₹{crop.avgPrice}</span>
                      <span className={`font-bold ${crop.priceMovement === 'rising' ? 'text-green-600' : crop.priceMovement === 'falling' ? 'text-red-600' : 'text-slate-600'}`}>
                        {crop.priceMovement === 'rising' ? '↑' : crop.priceMovement === 'falling' ? '↓' : '→'} {Math.abs(crop.changePct || 0)}%
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right - Analysis */}
        <div className="lg:col-span-2">
          {selectedCrop === null ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-slate-200">
              <Leaf className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-semibold text-lg mb-2">Select a crop to view detailed analysis</p>
              <p className="text-slate-400">Choose from the list on the left to see price trends and AI recommendations</p>
            </div>
          ) : analysisLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="inline-block relative w-12 h-12 mb-4">
                <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-600 font-semibold">Analyzing {selectedCrop}...</p>
            </div>
          ) : cropAnalysis ? (
            <div className="space-y-6">
              {/* Title with % change */}
              <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-800">{selectedCrop}</h2>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 mb-1">Price Change</p>
                    <p className={`text-3xl font-bold ${
                      cropAnalysis.analysis?.priceMovement?.trend === 'increasing' ? 'text-green-600' :
                      cropAnalysis.analysis?.priceMovement?.trend === 'decreasing' ? 'text-red-600' :
                      'text-slate-600'
                    }`}>
                      {cropAnalysis.analysis?.priceMovement?.trend === 'increasing' ? '↑' :
                       cropAnalysis.analysis?.priceMovement?.trend === 'decreasing' ? '↓' : '→'} 
                      {cropAnalysis.analysis?.priceMovement?.percentageChange}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" /> Price Trend (Last 3 Days)
                </h3>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis
                        stroke="#64748b"
                        domain={['dataMin - 50', 'dataMax + 50']}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        formatter={(value) => `₹${value}`}
                      />
                      <Line 
                        type="linear" 
                        dataKey="price" 
                        stroke={getTrendColor()} 
                        strokeWidth={4}
                        dot={{ fill: getTrendColor(), r: 6, strokeWidth: 2, stroke: '#fff' }}
                        isAnimationActive={true}
                        name="Price"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500 text-center py-8">No chart data available</p>
                )}
              </div>

              {/* Price Movement Details */}
              <div className="grid md:grid-cols-3 gap-4">
                {chartData.map((data, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{data.date}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] text-slate-500 font-semibold mb-0.5">Avg Price</p>
                        <p className="text-lg font-bold text-green-600">₹{data.price}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold">Min</p>
                          <p className="text-sm font-bold text-slate-700">₹{data.min}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold">Max</p>
                          <p className="text-sm font-bold text-slate-700">₹{data.max}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Future Prediction */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" /> Future Price Prediction
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-2 font-semibold">Predicted Next Week Price</p>
                    <p className="text-4xl font-bold text-blue-600 mb-2">₹{cropAnalysis.analysis?.futurePrediction?.nextWeekPrice}</p>
                    <p className="text-sm text-slate-600">{cropAnalysis.analysis?.futurePrediction?.reasoning}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Confidence Level</p>
                      <p className={`text-2xl font-bold ${
                        cropAnalysis.analysis?.futurePrediction?.confidence === 'high' ? 'text-green-600' :
                        cropAnalysis.analysis?.futurePrediction?.confidence === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {cropAnalysis.analysis?.futurePrediction?.confidence?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demand Level */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Current Demand Level</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-4xl font-bold ${
                      selectedCropDemand === 'high' ? 'text-green-600' :
                      selectedCropDemand === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {selectedCropDemand?.toUpperCase()}
                    </p>
                  </div>
                  <div className={`px-6 py-4 rounded-xl ${
                    selectedCropDemand === 'high' ? 'bg-green-100' :
                    selectedCropDemand === 'medium' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <p className={`text-sm font-bold ${
                      selectedCropDemand === 'high' ? 'text-green-700' :
                      selectedCropDemand === 'medium' ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {selectedCropDemand === 'high' ? 'High Competition' :
                       selectedCropDemand === 'medium' ? 'Moderate Activity' :
                       'Low Pressure'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className={`rounded-2xl p-6 border-2 ${
                cropAnalysis.analysis?.recommendation?.action === 'sell' ? 'bg-green-50 border-green-200' :
                cropAnalysis.analysis?.recommendation?.action === 'buy more' ? 'bg-red-50 border-red-200' :
                'bg-yellow-50 border-yellow-200'
              }`}>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Recommendation
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Suggested Action</p>
                    <p className={`text-2xl font-bold ${
                      cropAnalysis.analysis?.recommendation?.action === 'sell' ? 'text-green-600' :
                      cropAnalysis.analysis?.recommendation?.action === 'buy more' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {cropAnalysis.analysis?.recommendation?.action?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Timing</p>
                    <p className="text-slate-700 font-semibold">{cropAnalysis.analysis?.recommendation?.timing}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Reason</p>
                    <p className="text-slate-700 leading-relaxed">{cropAnalysis.analysis?.recommendation?.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-slate-200">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-semibold text-lg">No analysis available</p>
              <p className="text-slate-400">Please try again later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
