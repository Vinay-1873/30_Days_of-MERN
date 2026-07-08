const Habit = require('../models/Habit');


exports.createHabit = async (req, res) => {
    try {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Habit title is required' });
        }

        const newHabit = new Habit({
            title: title
        });

        await newHabit.save();
        return res.status(201).json({ message: 'Habit created!', habit: newHabit });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error creating habit' });
    }
};

exports.checkInHabit = async (req, res) => {
    try {
        const { id } = req.params;
        // We get the date from the client to respect the user's local timezone
        const { localDateString } = req.body; 

        if (!localDateString) {
            return res.status(400).json({ message: 'Local date string is required' });
        }

        const habit = await Habit.findById(id);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Normalize today's date (strip the hours, minutes, and seconds)
        const today = new Date(localDateString);
        today.setHours(0, 0, 0, 0); 

        // 1. FIRST EVER CHECK-IN
        if (!habit.lastCheckInDate) {
            habit.currentStreak = 1;
            habit.lastCheckInDate = today;
        } else {
            // Normalize the stored database date
            const lastCheckIn = new Date(habit.lastCheckInDate);
            lastCheckIn.setHours(0, 0, 0, 0);

            // Calculate the difference in milliseconds, then convert to days
            const diffTime = Math.abs(today - lastCheckIn);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // 2. IDEMPOTENCY: Already checked in today
            if (diffDays === 0) {
                return res.status(200).json({ message: 'Already checked in today!', habit });
            } 
            // 3. STREAK MAINTAINED: Exactly 1 day later
            else if (diffDays === 1) {
                habit.currentStreak += 1;
                habit.lastCheckInDate = today;
            } 
            // 4. STREAK BROKEN: More than 1 day has passed
            else {
                habit.currentStreak = 1;
                habit.lastCheckInDate = today;
            }
        }

        await habit.save();
        return res.status(200).json({ message: 'Check-in successful', habit });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error during check-in' });
    }
};