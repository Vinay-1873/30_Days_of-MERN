import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button 
            onClick={logout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700 font-medium">
            🔒 You are securely logged in. Only authenticated users can see this page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded shadow-sm bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">User Name</h3>
            <p className="text-lg font-medium text-gray-900">{user?.name}</p>
          </div>
          <div className="p-4 border rounded shadow-sm bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Email Address</h3>
            <p className="text-lg font-medium text-gray-900">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;