import { usePlantStore } from './store/plantStore'
import HomePage from './pages/HomePage'

function App() {
  const store = usePlantStore()

  return (
    <div className="min-h-screen bg-[#F5F2EC] max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <HomePage store={store} />
    </div>
  )
}

export default App
