import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Cloud, Sun, CloudRain, Wind } from 'lucide-react'

export default function WeatherWidget({ city, onCityChange }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showInput, setShowInput] = useState(!city)
  const [inputCity, setInputCity] = useState(city || '')

  useEffect(() => {
    if (city) fetchWeather(city)
  }, [city])

  const fetchWeather = async (cityName) => {
    setLoading(true)
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=zh&format=json`)
      const geo = await geoRes.json()
      if (!geo.results?.[0]) {
        setWeather({ error: '未找到该城市' })
        setLoading(false)
        return
      }
      const { latitude, longitude, name } = geo.results[0]
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`)
      const w = await weatherRes.json()
      setWeather({ ...w.current, cityName: name })
    } catch (e) {
      setWeather({ error: '获取天气失败' })
    }
    setLoading(false)
  }

  const getWeatherIcon = (code) => {
    if (code <= 1) return <Sun size={20} className="text-amber-400" />
    if (code <= 3) return <Cloud size={20} className="text-gray-400" />
    if (code <= 67) return <CloudRain size={20} className="text-blue-400" />
    return <Wind size={20} className="text-gray-400" />
  }

  const getWeatherText = (code) => {
    if (code <= 1) return '晴朗'
    if (code <= 3) return '多云'
    if (code <= 48) return '雾/霾'
    if (code <= 67) return '下雨'
    if (code <= 77) return '降雪'
    if (code <= 82) return '阵雨'
    return '雷暴'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputCity.trim()) {
      onCityChange(inputCity.trim())
      setShowInput(false)
    }
  }

  if (showInput) {
    return (
      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white/60 rounded-xl p-3 border border-wood-200"
      >
        <div className="flex gap-2">
          <input
            value={inputCity}
            onChange={e => setInputCity(e.target.value)}
            placeholder="输入城市名（如：北京）"
            className="flex-1 bg-cream-50 rounded-lg px-3 py-2 text-sm border border-wood-200 focus:outline-none focus:border-forest-400 text-forest-800 placeholder:text-forest-300"
          />
          <button
            type="submit"
            className="bg-forest-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            确定
          </button>
        </div>
      </motion.form>
    )
  }

  if (loading || !weather) {
    return (
      <div className="bg-white/60 rounded-xl p-4 border border-wood-200 animate-pulse">
        <div className="h-4 bg-wood-200 rounded w-24" />
      </div>
    )
  }

  if (weather.error) {
    return (
      <div className="bg-white/60 rounded-xl p-4 border border-wood-200">
        <p className="text-sm text-red-500">{weather.error}</p>
        <button onClick={() => setShowInput(true)} className="text-xs text-forest-500 mt-1">重新设置城市</button>
      </div>
    )
  }

  const isDry = weather.relative_humidity_2m < 40
  const isHot = weather.temperature_2m > 30

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-white/70 to-cream-50/70 rounded-xl p-4 border border-wood-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-forest-400" />
          <span className="text-sm font-medium text-forest-700">{weather.cityName}</span>
        </div>
        <button onClick={() => setShowInput(true)} className="text-[10px] text-forest-400">切换</button>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          {getWeatherIcon(weather.weather_code)}
          <span className="text-lg font-semibold text-forest-800">{Math.round(weather.temperature_2m)}°C</span>
        </div>
        <div className="text-xs text-forest-500">
          {getWeatherText(weather.weather_code)} · 湿度 {weather.relative_humidity_2m}%
        </div>
      </div>
      {(isDry || isHot) && (
        <div className="mt-2 text-xs bg-amber-50 text-amber-700 px-2 py-1.5 rounded-lg border border-amber-200">
          {isDry && '空气较干燥，观叶植物建议喷雾增湿'}
          {isDry && isHot && '，'}
          {isHot && '气温较高，注意遮阴并避开正午浇水'}
        </div>
      )}
    </motion.div>
  )
}
