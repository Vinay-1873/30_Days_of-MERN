
import React, { useState, useEffect } from 'react';
import HabitCard from './components/HabitCard';
import AddHabit from './components/AddHabit';

const response = await fetch('http://localhost:5000/api/habits');
function App() {
    const [habits, setHabits] = useState([]);

    // We pull this logic out so we can call it whenever we need to refresh the list
    const fetchHabits = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/habits`);
            if (response.ok) {
                const data = await response.json();
                setHabits(data);
            }
        } catch (error) {
            console.error("Failed to fetch habits:", error);
        }
    };

    // Load habits when the page first opens
    useEffect(() => {
        fetchHabits();
    }, []);

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1>My Habit Dashboard</h1>
            
            {/* The new form. When a habit is added, it calls fetchHabits to refresh the UI instantly */}
            <AddHabit onHabitAdded={fetchHabits} />

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {habits.map(habit => (
                    <HabitCard key={habit._id} habit={habit} />
                ))}
            </div>
        </div>
    );
}

export default App;