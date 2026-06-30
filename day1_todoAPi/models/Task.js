const mongoose =require('mongoose')

    const taskSchema = new mongoose.Schema({
        title: {
        type: String,
        required: [true, 'Please provide a task title'],
        trim: true, // Removes extra spaces before/after the title
        maxlength: [100, 'Title cannot be more than 100 characters']
        },
        description: {
        type: String,
        trim: true,
        default: '' // If no description is provided, it defaults to an empty string
        },
        isCompleted: {
        type: Boolean,
        default: false // New tasks are automatically marked as not completed
        },
        priority: {
        type: String,
        enum: ['low', 'medium', 'high'], // Only allows these exactly 3 values
        default: 'medium'
        }
    }, {
        timestamps: true
    });

    module.exports=mongoose.model('Task',taskSchema);
