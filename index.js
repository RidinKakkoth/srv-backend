import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
// import connectCloudinary from './config/cloudinary.js'
import authRoutes from './routes/authRoute.js'
import productRoutes from './routes/productRoutes.js'

//app config

const app=express()
const port=process.env.PORT||4000
connectDB()
// connectCloudinary()

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", 
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


//middlewares
app.use(express.json())
app.use(cors(corsOptions))


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);



app.listen(port,()=>console.log('server started',port)
)