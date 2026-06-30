const Task=require('../models/Task')
const getTask=async (req,res)=>{
    try{
        const tasks= await Task.find();
        res.status(200).json(tasks);
    }catch(error){
        res.status(500).json('message: error.message');
    }

}

const newTask=async(req,res)=>{
    try{
        const task= await Task.create(req.body);
        res.status(200).json(task);
    }catch(error){
        res.status(400).json('message: error.message');
    }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Use .deleteOne() on the found document
    await task.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports={getTask,newTask,updateTask,deleteTask};