import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import adminAuthRoutes from './Routes/adminAuthRoutes.js'
import customerAuthRoutes from './Routes/customerAuthRoutes.js'
import CarAuthRoutes from './Routes/CarRoutes.js'
import bookingRoutes from './Routes/bookingRoutes.js'
import feedbackRoutes from './Routes/feedbackRoutes.js'
import { connectDB } from './lib/db.js';
import cors from 'cors'

dotenv.config()

const app=express()


const PORT = process.env.PORT

app.use(express.json({ limit: '10mb' })); // Increase JSON body size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // For form data



app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/admin",adminAuthRoutes);
app.use("/customer",customerAuthRoutes)
app.use('/car',CarAuthRoutes)
app.use('/book',bookingRoutes)
app.use('/feedback',feedbackRoutes)
app.use('/uploads', express.static('uploads'));

app.get('/get/config/paypal',(req,res)=>res.sendStatus(process.env.PAYPAL_CLIENT_ID))

app.listen(PORT,()=>{
    console.log("mongoDB is connected to port : "+PORT)
    connectDB()
  
})