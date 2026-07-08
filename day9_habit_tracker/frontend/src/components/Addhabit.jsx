import React, { useState } from 'react';

const AddHabit = ({ onHabitAdded }) => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing
        
        if (!title.trim()) return;
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/habits',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: title }),
            });

            if (response.ok) {
                setTitle(''); // Clear the input field
                onHabitAdded(); // Tell the parent component to refresh the list
            }
        } catch (error) {
            console.error('Failed to add habit:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="New Habit (e.g., Read 10 Pages)" 
                style={{ padding: '10px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button 
                type="submit" 
                disabled={loading}
                style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
            >
                {loading ? 'Adding...' : 'Add Habit'}
            </button>
        </form>
    );
};

export default AddHabit;