import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: '园', label: '花园' },
    { to: '/season', icon: '时', label: '时节' },
    { to: '/profile', icon: '我', label: '我的' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div className="bg-[rgba(245,242,236,0.92)] backdrop-blur-md border-t border-[#e8e4dc] px-6 py-2.5 flex justify-around items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 transition-all duration-300 ${
                  isActive ? 'text-[#3d5a3d] scale-105' : 'text-[#7a9a7a]'
                }`
              }
            >
              <span className="text-[22px]" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>{item.icon}</span>
              <span className="text-[10px] font-light tracking-wider">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
