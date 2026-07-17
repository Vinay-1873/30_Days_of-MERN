const Poll = require('../models/Poll');


const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'A question and at least 2 options are required.' });
    }

    // Map string options into the structure expected by our schema
    const formattedOptions = options.map(option => ({ title: option, votes: 0 }));

    const newPoll = await Poll.create({
      question,
      options: formattedOptions,
    });

    res.status(201).json(newPoll);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating poll', error: error.message });
  }
};


const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching poll', error: error.message });
  }
};

module.exports = {
  createPoll,
  getPollById,
};