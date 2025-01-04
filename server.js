import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { Server } from 'socket.io';
import {createServer} from 'http'

import connectDB from './config/mongodb.js';
import userRoutes   from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import connectCloudinary from './config/cloudinary.js';


const corsOptions = {
    origin: process.env.CLIENT_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };


const app = express();
const httpServer=createServer(app)
const io=new Server(httpServer,{cors:corsOptions})

app.use(express.json());
app.use(cors(corsOptions));

// Database connection
connectDB()
connectCloudinary()

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);



// WebSocket setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      console.log(`User ${userId} joined their room`);
      socket.join(userId.toString()); // Join the room with the user's ID
    } else {
      console.log("Invalid userId received");
    }
  });
  

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

  // Example: Emit a message to a specific room
  // io.to('someUserId').emit("productUpdated", { productId: 1, changes: { name: "Updated Name" } });
});

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log('Server is running on port 5000');
});

export { io };