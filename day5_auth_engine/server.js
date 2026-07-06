import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config();
const app=express();

app.use(express.json());
app.use(cors());
app.use('/api/auth',authRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/',(req,res)=>{
    res.send('api is runing....');
});

const PORT= process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('connected to mongoDB');
        app.listen(PORT,()=> console.log(`server is running at ${PORT}`));
    })
    .catch((error)=>{
         console.error('connection failed', error.message);
    })
