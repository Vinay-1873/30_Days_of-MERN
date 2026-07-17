const Poll = require('../models/Poll');

module.exports = (io, socket) => {
  // Listen for the 'cast_vote' event from a client
  socket.on('cast_vote', async ({ pollId, optionId }) => {
    try {
      // Atomically increment the vote count for the specific option
      const updatedPoll = await Poll.findOneAndUpdate(
        { _id: pollId, 'options._id': optionId },
        { $inc: { 'options.$.votes': 1 } },
        { new: true } // Return the updated document after the increment
      );

      if (updatedPoll) {
        // Emit the 'poll_updated' event globally to ALL connected clients
        io.emit('poll_updated', updatedPoll);
      }
    } catch (error) {
      console.error(`Error casting vote: ${error.message}`);
      // Emit an error event back only to the client that attempted the vote
      socket.emit('vote_error', { message: 'Failed to register vote.' });
    }
  });
};