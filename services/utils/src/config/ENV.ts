import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_SECRET_KEY: process.env.CLOUD_SECRET_KEY,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    PAYMENT_QUEUE: process.env.PAYMENT_QUEUE,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RESTAURANT_SERVICE_URL: process.env.RESTAURANT_SERVICE_URL,
    INTERNAL_SERVICE_KEY: process.env.INTERNAL_SERVICE_KEY
};