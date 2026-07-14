const Message = require('../model/Message');

module.exports = (io, socket) => {
    
    // Join a specific room based on client request
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.user.id} joined room: ${roomId}`);
    });

    socket.on('send_message', async (data) => {
        try {
            // 1. Save to MongoDB first
            const newMessage = await Message.create({
                chatRoomId: data.roomId,
                senderId: socket.user.id, // Pulled securely from the JWT payload
                text: data.text
            });

            // 2. Broadcast ONLY to the specific room, including the new DB ID
            io.to(data.roomId).emit('receive_message', {
                _id: newMessage._id,
                senderId: socket.user.id,
                text: newMessage.text,
                createdAt: newMessage.createdAt
            });

        } catch (error) {
            console.error("Database write failed:", error);
            // Optionally emit an error back to the sender
            socket.emit('message_error', { error: "Failed to send message" });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.id}`);
    });
};