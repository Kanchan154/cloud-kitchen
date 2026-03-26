import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};