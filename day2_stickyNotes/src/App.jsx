import { useState, useEffect } from 'react';
import api from './api';


function StickyNote({ task, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-200 border-red-300 text-red-900';
    if (priority === 'medium') return 'bg-amber-200 border-amber-300 text-amber-900';
    return 'bg-emerald-200 border-emerald-300 text-emerald-900';
  };

  return (
    <div 
      className={`p-6 rounded-lg shadow-md border ${getPriorityColor(task.priority)} flex flex-col relative group transition-all duration-300 ${isExpanded ? 'h-auto z-10' : 'h-64'}`}
    >
      {/* Delete Button */}
      <button 
        onClick={(e) => onDelete(task._id, e)}
        className="absolute top-2 right-2 bg-black/10 hover:bg-red-500 hover:text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        title="Delete Note"
      >
        ✕
      </button>

      {/* Note Content Area */}
      {/* If expanded, it grows naturally. If closed, we hide the overflow. */}
      <div className="flex-grow overflow-hidden mb-4">
        <h2 className={`text-xl font-bold mb-2 pr-6 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {task.title}
        </h2>
        
        {/* line-clamp-4 restricts the paragraph to exactly 4 lines when folded */}
        <p className={`text-sm opacity-90 whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-4'}`}>
          {task.description}
        </p>
      </div>
      
      {/* Footer Area */}
      <div className="pt-4 border-t border-black/10 flex justify-between items-center mt-auto">
        <span className="text-xs font-bold uppercase tracking-wider">{task.priority}</span>
        
        {/* Expand / Fold Button */}
        {task.description && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold underline hover:opacity-70 cursor-pointer"
          >
            {isExpanded ? 'Fold Note' : 'Read More'}
          </button>
        )}
      </div>
    </div>
  );
}


function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/'); 
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError("Could not connect to the server.");
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/', newTask);
      setTasks([response.data, ...tasks]); 
      setNewTask({ title: '', description: '', priority: 'medium' });
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task.");
    }
  };

  const handleDeleteTask = async (id, e) => {
    e.stopPropagation(); 
    try {
      await api.delete(`/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">📌 Sticky Notes Wall</h1>
      </header>

      {/* The Create Task Form */}
      <div className="max-w-xl mx-auto mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Note Title..." 
            required
            maxLength={100}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <textarea 
            placeholder="Note Details..." 
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <div className="flex gap-4 items-center">
            <select 
              className="p-2 border border-gray-300 rounded-md bg-white cursor-pointer"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-bold w-full transition"
            >
              Pin to Wall
            </button>
          </div>
        </form>
      </div>
      
      {loading && <p className="text-center text-gray-500 font-medium">Loading notes...</p>}
      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {/* The Grid */}
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
        {/* We now use our new StickyNote component! */}
        {tasks.map((task) => (
          <StickyNote key={task._id} task={task} onDelete={handleDeleteTask} />
        ))}

        {!loading && tasks.length === 0 && (
          <div className="col-span-full text-center p-10 border-2 border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500">Your wall is empty! Let's add some notes.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;