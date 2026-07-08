import React, { useState } from 'react';

const HabitCard = ({ habit }) => {
    // Local state to instantly update the UI after a successful check-in
    const [streak, setStreak] = useState(habit.currentStreak);
    const [statusMessage, setStatusMessage] = useState('');

    const handleCheckIn = async () => {
        try {
            // Generate the local timestamp from the user's browser
            const localDateString = new Date().toISOString();

            const response = await fetch(`http://localhost:5000/api/habits/${habit._id}/checkin`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ localDateString }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update the streak counter based on the server's response
                setStreak(data.habit.currentStreak);
                setStatusMessage(data.message); // ex- "Check-in successful" or "Already checked in today!"
            } else {
                setStatusMessage(data.message || 'Check-in failed.');
            }
        } catch (error) {
            console.error('Network error:', error);
            setStatusMessage('Server error. Is the backend running?');
        }
    };

    return (
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', maxWidth: '300px' }}>
            <h2>{habit.title}</h2>
            <p>Current Streak: <strong>{streak}</strong> 🔥</p>
            
            <button 
                onClick={handleCheckIn} 
                style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
                Check In Today
            </button>

            {statusMessage && (
                <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                    {statusMessage}
                </p>
            )}
        </div>
    );
};

export default HabitCard;