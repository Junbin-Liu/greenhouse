import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

const LOCAL_VERSION = '1.2.0'

export default function ProfilePage({ store }) {
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [message, setMessage] = useState('')
  const [updateStatus, setUpdateStatus] = useState('idle')
  const [remoteVersion, setRemoteVersion] = useState('')

  const showToast = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 2500)
  }

  const handleExport = () => {
    const data = store.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `青舍备份_${new Date().toLocaleDateString('zh-CN')}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('备份已下载')
  }

  const handleImport = () => {
    if (!importText.trim()) return
    const ok = store.importData(importText.trim())
    if (ok) {
      showToast('数据恢复成功')
      setImportText('')
      setShowImport(false)
    } else {
      showToast('数据格式错误')
    }
  }

  const checkUpdate = async () => {
    setUpdateStatus('checking')
    try {
      const res = await fetch(`/greenhouse/version.json?t=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('fetch failed')
      const json = await res.json()
      setRemoteVersion(json.version)
      if (json.version !== LOCAL_VERSION) {
        setUpdateStatus('available')
      } else {
        setUpdateStatus('latest')
        setTimeout(() => setUpdateStatus('idle'), 2000)
      }
    } catch (e) {
      showToast('检查失败，请检查网络')
      setUpdateStatus('idle')
    }
  }

  const doUpdate = () => {
    window.location.reload(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-5 pt-7 pb-4"
    >
      <div className="text-center py-6 mb-6">
        <div className="w-16 h-16 rounded-full bg-[rgba(90,124,90,0.1)] flex items-center justify-center mx-auto mb-3 border border-[rgba(90,124,90,0.15)]">
          <span className="text-3xl" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>青</span>
        </div>
        <h1 className="text-xl font-bold text-[#1a2f1a]" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>青舍</h1>
        <p className="text-xs text-[#7a9a7a] mt-1 tracking-wider">v{LOCAL_VERSION} · 你的私人花房管家</p>
      </div>

      {/* 版本更新 */}
      <div className="bg-[#faf8f4] rounded-xl border border-[#e8e4dc] overflow-hidden mb-5">
        <div className="px-4 py-3 border-b border-[#e8e4dc]">
          <h2 className="text-sm font-semibold text-[#1a2f1a]">版本更新</h2>
        </div>
        <div className="p-4">
          <AnimatePresence mode="wait">
            {updateStatus === 'available' ? (
              <motion.div
                key="available"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-[#fff8e7] rounded-lg p-3 border border-[#f0e0b0]"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} className="text-[#b8956a] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#8b6914]">发现新版本 v{remoteVersion}</p>
                    <p className="text-xs text-[#a89060] mt-0.5">当前版本 v{LOCAL_VERSION}，建议立即更新</p>
                    <button
                      onClick={doUpdate}
                      className="mt-2 w-full py-2 bg-[#3d5a3d] text-white rounded-lg text-sm font-medium"
                    >
                      立即刷新更新
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : updateStatus === 'latest' ? (
              <motion.div
                key="latest"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-[#e8ede3] rounded-lg p-3 border border-[#d4e0d0] flex items-center gap-2"
              >
                <CheckCircle2 size={18} className="text-[#5a7c5a] shrink-0" />
                <p className="text-sm text-[#3d5a3d]">已是最新版本</p>
              </motion.div>
            ) : (
              <motion.button
                key="check"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={checkUpdate}
                disabled={updateStatus === 'checking'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#f0ece4] text-[#3d5a3d] text-sm font-medium hover:bg-[#e8e4dc] transition-colors disabled:opacity-60"
              >
                <RefreshCw size={16} className={updateStatus === 'checking' ? 'animate-spin' : ''} />
                {updateStatus === 'checking' ? '检查中...' : '检查更新'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-[#faf8f4] rounded-xl border border-[#e8e4dc] overflow-hidden mb-5">
        <div className="px-4 py-3 border-b border-[#e8e4dc]">
          <h2 className="text-sm font-semibold text-[#1a2f1a]">数据管理</h2>
        </div>
        <div className="p-4 space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#e8ede3] text-[#3d5a3d] text-sm font-medium hover:bg-[#d4e0d0] transition-colors"
          >
            <Download size={18} />
            导出备份
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#f0ece4] text-[#3d5a3d] text-sm font-medium hover:bg-[#e8e4dc] transition-colors"
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
                className="w-full h-24 bg-[#f5f2ec] rounded-lg p-3 text-xs border border-[#e8e4dc] focus:outline-none focus:border-[#5a7c5a] text-[#1a2f1a]"
              />
              <button
                onClick={handleImport}
                className="w-full py-2 bg-[#3d5a3d] text-white rounded-lg text-sm font-medium"
              >
                确认恢复
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* 关于 */}
      <div className="bg-[#faf8f4] rounded-xl border border-[#e8e4dc] p-4 mb-4">
        <h2 className="text-sm font-semibold text-[#1a2f1a] mb-3">关于</h2>
        <div className="space-y-2 text-xs text-[#5a7c5a]">
          <p>青舍是一款专注于绿植养护管理的 PWA 应用。</p>
          <p>所有数据存储在本地浏览器中，不会上传至服务器。</p>
          <p>天气数据来自 Open-Meteo 免费 API。</p>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 left-0 right-0 flex justify-center z-50"
          >
            <div className="bg-[#3d5a3d] text-white text-sm px-4 py-2 rounded-full shadow-lg">
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center pt-4 pb-8">
        <p className="text-[10px] text-[#7a9a7a] tracking-wider">
          为植物爱好者而作
        </p>
      </div>
    </motion.div>
  )
}
