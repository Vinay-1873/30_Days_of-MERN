import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

export default function NotificationBadge() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    // Define the event listener
    const handleNewNotification = (payload) => {
      console.log('Received notification:', payload);
      setCount((prev) => prev + 1);
      
      // Trigger a tiny CSS animation when a new alert comes in
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    };

    // Attach the listener
    socket.on('new_notification', handleNewNotification);

    // Cleanup listener on unmount to prevent memory leaks
    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket]);

  return (
    <div className="relative cursor-pointer select-none">
      <div className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isAnimating ? 'scale-110' : 'scale-100'}`}>
        <Bell className="w-6 h-6 text-gray-700" />
      </div>
      
      {/* Badge dynamically renders if count > 0 */}
      {count > 0 && (
        <div className="absolute top-0 right-0 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white transform translate-x-1 -translate-y-1">
          {count > 99 ? '99+' : count}
        </div>
      )}
    </div>
  );
}