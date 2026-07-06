// src/App.jsx
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [markdownText, setMarkdownText] = useState('# Welcome to Day 7\n\nStart typing here...');
  const [syncStatus, setSyncStatus] = useState('Saved');

  // --- THE DEBOUNCE MECHANISM ---
  useEffect(() => {
    // 1. Set the status to 'Typing...' as soon as the text changes
    setSyncStatus('Typing...');

    // 2. Start a timer for 1000ms (1 second)
    const delayDebounceFn = setTimeout(async () => {
      setSyncStatus('Saving...');
      
      try {
        // Hardcoded dummy ID for prototyping - replace with a real MongoDB ObjectId
        const noteId = '6a4bbcd5d991d586b8cb061f'; 
        
        const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: markdownText }),
        });

        if (response.ok) {
          setSyncStatus('Saved');
        } else {
          setSyncStatus('Error');
        }
      } catch (error) {
        console.error('Failed to sync:', error);
        setSyncStatus('Error');
      }

    }, 1000);

    // 4. The Cleanup Function (Crucial for Interviews!)
    // If the markdownText state changes BEFORE the 1000ms timer finishes,
    // React runs this return function, which cancels the previous timer.
    return () => clearTimeout(delayDebounceFn);

  }, [markdownText]); 
  // Dependency array: This effect runs every time 'markdownText' changes

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Markdown Note-Taking App</h1>
        {/* Dynamic Status Indicator */}
        <p className={`mt-2 font-medium ${syncStatus === 'Saved' ? 'text-green-600' : 'text-amber-500'}`}>
          Status: {syncStatus}
        </p>
      </header>

      {/* Main Grid Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-xl shadow-lg">
        
        {/* Editor Section */}
        <div className="flex flex-col h-[70vh]">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 border-b pb-2">Editor</h2>
          <textarea
            className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
            placeholder="Write your markdown here..."
          />
        </div>

        {/* Live Preview Section */}
        <div className="flex flex-col h-[70vh]">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 border-b pb-2">Preview</h2>
          <div className="flex-1 w-full p-4 border border-gray-200 bg-gray-50 rounded-lg overflow-y-auto prose prose-blue max-w-none">
            <ReactMarkdown>
              {markdownText}
            </ReactMarkdown>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;