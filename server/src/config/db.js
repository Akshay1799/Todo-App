import mongoose from'mongoose';
import { config } from './index.js';

export const connectDB = async()=>{
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Database connected successfully!');
    } catch (error) {
        console.log('Database connection error: ', error.message);
        process.exit(1);
    }
    
}