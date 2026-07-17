// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [activePoll, setActivePoll] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  
  // NEW: State to track if the current user has voted in this poll
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState(null);

  // NEW: Check Local Storage whenever the active poll changes
  useEffect(() => {
    if (activePoll) {
      const savedVote = localStorage.getItem(`voted_${activePoll._id}`);
      if (savedVote) {
        setHasVoted(true);
        setVotedOption(savedVote);
      } else {
        // Reset if it's a brand new poll they haven't voted on
        setHasVoted(false);
        setVotedOption(null);
      }
    }
  }, [activePoll?._id]);

  useEffect(() => {
    socket.on('connect', () => console.log('Connected with ID:', socket.id));

    socket.on('new_poll_created', (newPoll) => setActivePoll(newPoll));

    socket.on('poll_updated', (updatedPoll) => {
      setActivePoll((current) => 
        current && current._id === updatedPoll._id ? updatedPoll : current
      );
    });

    return () => {
      socket.off('connect');
      socket.off('new_poll_created');
      socket.off('poll_updated');
    };
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createPoll = async (e) => {
    e.preventDefault();
    try {
      const validOptions = options.filter(opt => opt.trim() !== '');
      const response = await axios.post('http://localhost:5000/api/polls', {
        question,
        options: validOptions
      });
      setActivePoll(response.data);
      setQuestion('');
      setOptions(['', '']);
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  const castVote = (optionId) => {
    // NEW: Block the vote if they have already voted
    if (activePoll && !hasVoted) {
      socket.emit('cast_vote', { pollId: activePoll._id, optionId });
      
      // Save their vote to Local Storage immediately
      localStorage.setItem(`voted_${activePoll._id}`, optionId);
      setHasVoted(true);
      setVotedOption(optionId);
    }
  };

  const totalVotes = activePoll ? activePoll.options.reduce((acc, opt) => acc + opt.votes, 0) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Create Poll Section (Unchanged) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Create a New Poll</h2>
          <form onSubmit={createPoll} className="space-y-4">
            <div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              {options.map((opt, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required={index < 2}
                />
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <button type="button" onClick={() => setOptions([...options, ''])} className="text-sm text-indigo-600 font-medium">
                + Add another option
              </button>
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
                Launch Poll
              </button>
            </div>
          </form>
        </section>

        {/* Live Voting Section */}
        {activePoll && (
          <section className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 relative overflow-hidden">
            <h2 className="text-3xl font-bold mb-2">{activePoll.question}</h2>
            <p className="text-gray-500 text-sm mb-6">Live updates • {totalVotes} total votes</p>

            <div className="space-y-4">
              {activePoll.options.map((option) => {
                const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                
                // NEW: Determine if this specific option is the one the user picked
                const isSelected = votedOption === option._id;

                return (
                  <div 
                    key={option._id}
                    onClick={() => castVote(option._id)}
                    // NEW: Dynamically change styling based on whether they have voted
                    className={`relative block w-full bg-gray-100 rounded-lg p-4 transition-all group border
                      ${hasVoted ? 'cursor-default' : 'cursor-pointer hover:bg-gray-200 hover:border-gray-400'} 
                      ${isSelected ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50' : 'border-transparent'}
                    `}
                  >
                    <div 
                      className="absolute top-0 left-0 h-full bg-indigo-200 rounded-lg transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    
                    <div className="relative z-10 flex justify-between items-center">
                      <span className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>
                        {option.title} {isSelected && '✓'}
                      </span>
                      <span className="font-medium text-indigo-800 bg-white/70 px-2 py-1 rounded shadow-sm">
                        {percentage}% ({option.votes})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;