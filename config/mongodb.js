import mongoose from 'mongoose'
// import {createAdminUser} from '../controllers/authController.js'

const connectDB=async()=>{
    
    mongoose.connection.on('connected',()=>console.log('Database connected'))
    // createAdminUser()

    await mongoose.connect(`${process.env.MONGODB_URI}`)
}


export default connectDB