import { NavLink } from 'react-router-dom'
import { Home, Calendar, Leaf, User } from 'lucide-react'

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: '花园' },
    { to: '/season', icon: Calendar, label: '时节' },
    { to: '/profile', icon: User, label: '我的' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div className="glass border-t border-wood-200 px-6 py-2 flex justify-around items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 transition-all duration-300 ${
                  isActive ? 'text-forest-500 scale-105' : 'text-forest-300'
                }`
              }
            >
              <item.icon size={22} strokeWidth={2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
