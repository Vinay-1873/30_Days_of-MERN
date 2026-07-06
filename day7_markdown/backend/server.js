require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));  

// 2. Mongoose Schema & Model
const noteSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Note' },
  content: { type: String, default: '' },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

const initializeNote = async () => {
  try {
    const notes = await Note.find();
    if (notes.length === 0) {
      const newNote = await Note.create({ title: "My First Note", content: "" });
      console.log(`\n=== COPY THIS ID ===\n${newNote._id}\n====================\n`);
    } else {
      console.log(`\n=== USE THIS ID IN APP.JSX ===\n${notes[0]._id}\n==============================\n`);
    }
  } catch (error) {
    console.error("Error initializing note:", error);
  }
};

initializeNote();

// 3. The Auto-Save Route (PATCH)
// Using PATCH instead of POST ensures we are modifying an existing document, 
// protecting database integrity and preventing duplicate entries.
app.patch('/api/notes/:id', async (req, res) => {
  try {
    const { content } = req.body;
    
    // Find the note by ID and update its content
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id, 
      { content }, 
      { returnDocument: 'after' } // The modern, warning-free syntax
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Auto-save successful', note: updatedNote });
  } catch (error) {
    console.error('Auto-save error:', error);
    res.status(500).json({ message: 'Server error during auto-save' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));