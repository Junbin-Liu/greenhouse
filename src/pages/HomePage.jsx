import { motion } from 'framer-motion'
import { Droplets, Sprout, ChevronRight } from 'lucide-react'
import PlantCard from '../components/PlantCard'
import WeatherWidget from '../components/WeatherWidget'
import WaterButton from '../components/WaterButton'

export default function HomePage({ store }) {
  const plants = store.getMyPlants()
  const duePlants = plants.filter(p => p.status === 'due' || p.status === 'overdue')
  const healthyPlants = plants.filter(p => p.status === 'healthy')

  const handleQuickWater = (e, id) => {
    e.stopPropagation()
    store.waterPlant(id, '快速浇水')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 pt-6 pb-4 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-800 tracking-tight">青舍</h1>
          <p className="text-sm text-forest-400 mt-0.5">你的私人花房管家</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
          <Sprout size={20} className="text-forest-500" />
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget city={store.city} onCityChange={store.setCity} />

      {/* Today's Todo */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-forest-700 flex items-center gap-1.5">
            <Droplets size={16} className="text-water-500" />
            今日待办
          </h2>
          <span className="text-xs text-forest-400">{duePlants.length} 株需照顾</span>
        </div>

        {duePlants.length > 0 ? (
          <div className="space-y-3">
            {duePlants.map((plant, i) => (
              <div key={plant.id} className="relative">
                <PlantCard plant={plant} index={i} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <WaterButton size="sm" onWater={() => store.waterPlant(plant.id, '首页快速浇水')} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-moss-100/50 rounded-2xl p-6 text-center border border-moss-200"
          >
            <div className="text-3xl mb-2">🌿</div>
            <p className="text-sm text-forest-600 font-medium">今日暂无待办</p>
            <p className="text-xs text-forest-400 mt-1">你的植物们都喝饱啦，休息一下吧</p>
          </motion.div>
        )}
      </div>

      {/* My Plants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-forest-700">我的植物</h2>
          <span className="text-xs text-forest-400">共 {plants.length} 株</span>
        </div>
        <div className="space-y-3">
          {healthyPlants.map((plant, i) => (
            <PlantCard key={plant.id} plant={plant} index={i} />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '总浇水', value: plants.reduce((s, p) => s + (p.logs?.filter(l => l.type === 'water').length || 0), 0), unit: '次' },
          { label: '平均健康', value: Math.round(plants.reduce((s, p) => s + (p.health || 80), 0) / plants.length), unit: '%' },
          { label: '花园天数', value: Math.max(1, Math.floor((Date.now() - new Date(plants[0]?.addedAt).getTime()) / 86400000)), unit: '天' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-white/50 rounded-xl p-3 text-center border border-wood-200"
          >
            <p className="text-lg font-bold text-forest-700">{stat.value}{stat.unit}</p>
            <p className="text-[10px] text-forest-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
