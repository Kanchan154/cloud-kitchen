import mongoose from 'mongoose';
import { ENV } from './ENV.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGODB_URI as string, {
            dbName: "Zomato_Clone"
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;