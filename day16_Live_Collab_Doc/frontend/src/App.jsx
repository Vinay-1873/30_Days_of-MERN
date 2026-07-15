import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function App() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Use a ref to track if the change came from the user typing or the socket receiving
  const isLocalChange = useRef(false);

  // 1. Initialize Socket Connection
  useEffect(() => {
    const s = io(import.meta.env.VITE_BACKEND_URL);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // 2. Handle Document Loading & Syncing
  useEffect(() => {
    if (!socket || !documentId) return;

    // Ask server for the document
    socket.emit('get-document', documentId);

    // Load initial data
    socket.once('load-document', (data) => {
      setContent(data || "");
    });

    // Listen for incoming changes from other users
    const handleReceiveChanges = (newContent) => {
      isLocalChange.current = false;
      setContent(newContent);
    };

    socket.on('receive-changes', handleReceiveChanges);

    return () => {
      socket.off('receive-changes', handleReceiveChanges);
    };
  }, [socket, documentId]);

  // 3. Handle Local Typing
  const handleChange = (e) => {
    const newText = e.target.value;
    isLocalChange.current = true;
    setContent(newText);

    if (socket) {
      socket.emit('send-changes', newText);
    }
  };

  // 4. Auto-Save to MongoDB (Debounced)
  useEffect(() => {
    if (!socket || !isLocalChange.current) return;

    setIsSaving(true);
    const saveTimeout = setTimeout(() => {
      socket.emit('save-document', content);
      setIsSaving(false);
    }, 2000); // Saves 2 seconds after the user stops typing

    return () => clearTimeout(saveTimeout);
  }, [content, socket]);

  return (
    <div className="flex flex-col h-screen bg-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-xl font-bold text-slate-700">
          📄 Live Doc: <span className="font-mono text-blue-600 font-normal">{documentId}</span>
        </h1>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${isSaving ? 'text-amber-500' : 'text-emerald-500'}`}>
            {isSaving ? 'Saving...' : 'Saved to Cloud'}
          </span>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </header>

      {/* Editor Area */}
      <main className="flex-grow flex shadow-lg rounded-xl overflow-hidden border border-slate-200 bg-white">
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full h-full p-6 text-lg text-slate-800 focus:outline-none resize-none"
          placeholder="Start typing... anyone with this URL can collaborate live!"
        />
      </main>
    </div>
  );
}