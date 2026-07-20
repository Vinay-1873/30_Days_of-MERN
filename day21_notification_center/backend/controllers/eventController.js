const { getIo } = require('../sockets');

const triggerNotification = (req, res) => {
    try {
        const { title, message } = req.body;
        
        // Construct the payload
        const notificationPayload = {
            id: Date.now(),
            title: title || 'System Alert',
            message: message || 'A backend event was triggered!',
            timestamp: new Date()
        };

        const io = getIo();
        io.emit('new_notification', notificationPayload);

        res.status(200).json({
            success: true,
            message: 'Notification event triggered and broadcasted.',
            data: notificationPayload
        });
    } catch (error) {
        console.error('Error triggering notification:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { triggerNotification };