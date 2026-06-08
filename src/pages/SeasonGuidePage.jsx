import { motion } from 'framer-motion'
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
    spring: '🌱',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
  }

  const seasonKey = Object.keys(SEASON_ADVICE).find(k => SEASON_ADVICE[k].months.includes(month)) || 'spring'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-5 pt-7 pb-4"
    >
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#1a2f1a] tracking-[4px]" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
          时节指南
        </h1>
        <p className="text-xs text-[#7a9a7a] mt-1 tracking-wider">顺应天时，善待草木</p>
      </div>

      {/* 当前季节 */}
      <div className="bg-gradient-to-br from-[rgba(90,124,90,0.08)] to-[rgba(139,185,150,0.05)] rounded-xl p-5 border border-[rgba(90,124,90,0.12)] mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{seasonIcons[seasonKey]}</span>
          <h2 className="text-lg font-bold text-[#1a2f1a]">{currentSeason.name} · {currentSeason.theme}</h2>
        </div>
        <div className="space-y-2">
          {currentSeason.tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-sm text-[#3d5a3d]"
            >
              <span className="w-5 h-5 rounded-full bg-[rgba(90,124,90,0.15)] text-[#3d5a3d] text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{tip}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 植物时令建议 */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg text-[#1a2f1a]" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>我的植物时令建议</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#e8e4dc] to-transparent" />
        </div>
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
                className="bg-[#faf8f4] rounded-xl p-4 border border-[#e8e4dc]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e8e4dc]">
                    <img src={plant.info?.image} alt={plant.nickname} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-medium text-[#1a2f1a]">{plant.nickname}</h3>
                </div>
                <div className="space-y-1">
                  {advices.map((a, j) => (
                    <p key={j} className="text-xs text-[#5a7c5a] flex items-start gap-1.5">
                      <span className="text-[#7a9a7a] mt-0.5">•</span>
                      {a}
                    </p>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-[#7a9a7a]">{month}月 · {new Date().getFullYear()}年</p>
      </div>
    </motion.div>
  )
}
