import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    INTERNAL_SERVICE_KEY: process.env.INTERNAL_SERVICE_KEY

}