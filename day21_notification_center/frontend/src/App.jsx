import axios from 'axios';
import { SocketProvider } from './contexts/SocketContext';
import Header from './components/layout/Header';

function App() {
  
  // Helper to test the backend trigger easily from the UI
  const triggerBackendEvent = async () => {
    try {
      await axios.post('http://localhost:5000/api/events/trigger', {
        title: 'New Order',
        message: 'A new user just purchased a subscription.'
      });
    } catch (error) {
      console.error('Error triggering event:', error);
    }
  };

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Day 21: Real-Time Notifications
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your Socket.io connection is active. When the backend emits a <code>new_notification</code> event, the bell icon in the header will instantly increment across all open browser tabs.
            </p>
            
            <button 
              onClick={triggerBackendEvent}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors active:scale-95"
            >
              Trigger Backend POST Request
            </button>
            
            <p className="text-sm text-gray-400 mt-4">
              Tip: Open this page in two separate browser windows side-by-side, click the button in one window, and watch the bell update in both!
            </p>
          </div>
        </main>
      </div>
    </SocketProvider>
  );
}

export default App;