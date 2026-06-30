const express= require('express');
const router=express.Router();
const {getTask,newTask,updateTask,deleteTask}=require('../controllers/controller');
  

router.route('/')
    .get(getTask)
    .post(newTask);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask)    


module.exports=router;    
    