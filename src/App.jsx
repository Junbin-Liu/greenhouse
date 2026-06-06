import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePlantStore } from './store/plantStore'
import HomePage from './pages/HomePage'
import PlantDetailPage from './pages/PlantDetailPage'
import SeasonGuidePage from './pages/SeasonGuidePage'
import ProfilePage from './pages/ProfilePage'
import BottomNav from './components/BottomNav'

function App() {
  const store = usePlantStore()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-cream-100 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <div className="pb-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage store={store} />} />
            <Route path="/plant/:id" element={<PlantDetailPage store={store} />} />
            <Route path="/season" element={<SeasonGuidePage store={store} />} />
            <Route path="/profile" element={<ProfilePage store={store} />} />
          </Routes>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  )
}

export default App
