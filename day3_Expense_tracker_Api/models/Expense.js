const mongoose =require('mongoose')

const expanseSchema= new mongoose.Schema({
    title:{
        type:"String",
        required:[true,"Please add the title"],
        trim:true
    },
    amount:{
        type:Number,
        required:[true,"Please add an amount"]
    },
    category:{
        type:"String",
        required:[true,"please add category"],
        enum:['Food', 'Rent', 'Utilities', 'Software/APIs', 'Entertainment', 'Other']
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Expense', expanseSchema);