import { motion } from 'framer-motion'
import { Calendar, Sun, CloudRain, Snowflake, Leaf } from 'lucide-react'
import { SEASON_ADVICE } from '../data/plantDatabase'

export default function SeasonGuidePage({ store }) {
  const month = new Date().getMonth() + 1
  const currentSeason = Object.values(SEASON_ADVICE).find(s => s.months.includes(month)) || SEASON_ADVICE.spring

  const plants = store.getMyPlants()

  const getPlantSeasonAdvice = (plant) => {
    const advices = []
    const info = plant.info
    if (!info) return advices

    if (month >= 6 && month <= 8) {
      if (info.tags.includes('喜湿')) advices.push('高温季节，早晚喷雾增湿')
      if (info.waterInterval <= 4) advices.push('生长旺季，注意及时补水')
      if (info.tags.includes('喜阳')) advices.push('正午适当遮阴，避免暴晒')
    } else if (month >= 12 || month <= 2) {
      if (info.tags.includes('喜湿')) advices.push('冬季减少浇水，保持土壤微湿即可')
      advices.push('注意远离暖气，避免干燥')
    } else if (month >= 3 && month <= 5) {
      advices.push('春季生长旺季，可适量追肥')
      if (info.category === '多肉花卉') advices.push('换盆好时节')
    } else {
      advices.push('逐渐减少浇水，为越冬做准备')
    }

    return advices
  }

  const seasonIcons = {
    spring: <Leaf size={20} className="text-moss-400" />,
    summer: <Sun size={20} className="text-amber-400" />,
    autumn: <Leaf size={20} className="text-wood-400" />,
    winter: <Snowflake size={20} className="text-blue-300" />,
  }

  const seasonKey = Object.keys(SEASON_ADVICE).find(k => SEASON_ADVICE[k].months.includes(month)) || 'spring'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 pt-6 pb-4 space-y-5"
    >
      <div>
        <h1 className="text-2xl font-bold text-forest-800">时节指南</h1>
        <p className="text-sm text-forest-400 mt-0.5">顺应天时，善待草木</p>
      </div>

      {/* Current Season Card */}
      <div className="bg-gradient-to-br from-forest-50 to-moss-100 rounded-2xl p-5 border border-forest-200">
        <div className="flex items-center gap-2 mb-3">
          {seasonIcons[seasonKey]}
          <h2 className="text-lg font-bold text-forest-700">{currentSeason.name} · {currentSeason.theme}</h2>
        </div>
        <div className="space-y-2">
          {currentSeason.tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-sm text-forest-600"
            >
              <span className="w-5 h-5 rounded-full bg-forest-200 text-forest-700 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{tip}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* My Plants Season Advice */}
      <div>
        <h2 className="text-base font-semibold text-forest-700 mb-3 flex items-center gap-1.5">
          <Calendar size={16} />
          我的植物时令建议
        </h2>
        <div className="space-y-3">
          {plants.map((plant, i) => {
            const advices = getPlantSeasonAdvice(plant)
            if (advices.length === 0) return null
            return (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/60 rounded-xl p-4 border border-wood-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{plant.info?.emoji}</span>
                  <h3 className="font-medium text-forest-700">{plant.nickname}</h3>
                </div>
                <div className="space-y-1">
                  {advices.map((a, j) => (
                    <p key={j} className="text-xs text-forest-500 flex items-start gap-1.5">
                      <span className="text-forest-300 mt-0.5">•</span>
                      {a}
                    </p>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Monthly Calendar Hint */}
      <div className="bg-cream-50 rounded-xl p-4 border border-wood-200">
        <p className="text-xs text-forest-400 text-center">
          {month}月 · {new Date().getFullYear()}年
        </p>
      </div>
    </motion.div>
  )
}
