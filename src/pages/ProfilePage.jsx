import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Upload, Trash2, Sprout, Heart } from 'lucide-react'

export default function ProfilePage({ store }) {
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [message, setMessage] = useState('')

  const handleExport = () => {
    const data = store.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `青舍备份_${new Date().toLocaleDateString('zh-CN')}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('备份已下载')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleImport = () => {
    if (!importText.trim()) return
    const ok = store.importData(importText.trim())
    if (ok) {
      setMessage('数据恢复成功')
      setImportText('')
      setShowImport(false)
    } else {
      setMessage('数据格式错误')
    }
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 pt-6 pb-4 space-y-5"
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-3">
          <Sprout size={28} className="text-forest-500" />
        </div>
        <h1 className="text-xl font-bold text-forest-800">青舍</h1>
        <p className="text-xs text-forest-400 mt-1">v1.0 · 你的私人花房管家</p>
      </div>

      {/* Data Management */}
      <div className="bg-white/60 rounded-2xl border border-wood-200 overflow-hidden">
        <div className="p-4 border-b border-wood-100">
          <h2 className="text-sm font-semibold text-forest-700">数据管理</h2>
        </div>
        <div className="p-4 space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-forest-50 text-forest-700 text-sm font-medium hover:bg-forest-100 transition-colors"
          >
            <Download size={18} />
            导出备份
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-wood-100 text-forest-700 text-sm font-medium hover:bg-wood-200 transition-colors"
          >
            <Upload size={18} />
            恢复数据
          </button>

          {showImport && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="粘贴备份 JSON 内容..."
                className="w-full h-24 bg-cream-50 rounded-lg p-3 text-xs border border-wood-200 focus:outline-none focus:border-forest-400 text-forest-700"
              />
              <button
                onClick={handleImport}
                className="w-full py-2 bg-forest-500 text-white rounded-lg text-sm font-medium"
              >
                确认恢复
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-white/60 rounded-2xl border border-wood-200 p-4">
        <h2 className="text-sm font-semibold text-forest-700 mb-3">关于</h2>
        <div className="space-y-2 text-xs text-forest-500">
          <p>青舍是一款专注于绿植养护管理的 PWA 应用。</p>
          <p>所有数据存储在本地浏览器中，不会上传至服务器。</p>
          <p>天气数据来自 Open-Meteo 免费 API。</p>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 left-0 right-0 flex justify-center z-50"
        >
          <div className="bg-forest-700 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {message}
          </div>
        </motion.div>
      )}

      <div className="text-center pt-4 pb-8">
        <p className="text-[10px] text-forest-300 flex items-center justify-center gap-1">
          Made with <Heart size={10} className="text-red-400 fill-current" /> for plant lovers
        </p>
      </div>
    </motion.div>
  )
}
