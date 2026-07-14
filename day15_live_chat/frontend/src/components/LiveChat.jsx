import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, LogOut } from 'lucide-react'; // Icons

const LiveChat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [room, setRoom] = useState("general_chat");
    const [isConnected, setIsConnected] = useState(false);
    
    // Ref to automatically scroll to the newest message
    const messagesEndRef = useRef(null);

    // 1. Initialize Connection
    useEffect(() => {
        // In a real app, this token comes from your Auth Context (Day 8 integration) [cite: 19]
        // For testing, we pull the mock token you generated earlier
        const token = localStorage.getItem('chat_token');

        const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
            auth: { token }
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            newSocket.emit('join_room', room);
        });

        newSocket.on('connect_error', (err) => {
            console.error("Connection failed:", err.message);
        });

        setSocket(newSocket);

        // CLEANUP: Prevent memory leaks and duplicate listeners
        return () => {
            newSocket.disconnect();
        };
    }, [room]);

    // 2. Listen for Incoming Messages
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        };

        socket.on('receive_message', handleNewMessage);

        // CLEANUP: Remove specific listener before re-rendering
        return () => {
            socket.off('receive_message', handleNewMessage);
        };
    }, [socket]);

    // 3. Auto-scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 4. Send Message Handler
    const sendMessage = (e) => {
        e.preventDefault();
        if (inputText.trim() && socket) {
            socket.emit('send_message', {
                roomId: room,
                text: inputText
            });
            setInputText("");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Engineering Lounge</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-500">{isConnected ? 'Connected' : 'Connecting...'}</span>
                    </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    #{room}
                </span>
            </header>

            {/* Chat History */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        // Assuming socket.id is passed back, or compare senderId with your local User ID
                        const isMe = msg.socketId === socket?.id;
                        
                        return (
                            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                                    isMe 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <span className={`text-[10px] mt-1 block ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'Just now'}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Message Input */}
            <footer className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputText.trim() || !isConnected}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default LiveChat;