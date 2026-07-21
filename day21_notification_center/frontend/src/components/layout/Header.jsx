import NotificationBadge from '../notifications/NotificationBadge';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-sm"></div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            MERN Stack App
          </span>
        </div>
        
        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Settings</a>
          
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          
          <NotificationBadge />
          
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden ml-2 cursor-pointer">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover bg-gray-100" />
          </div>
        </nav>
      </div>
    </header>
  );
}