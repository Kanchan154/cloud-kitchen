import express, { Request, Response, NextFunction } from 'express';

import { ENV } from './config/ENV.js';
import connectDB from './config/db.js';

const app = express();


app.listen(ENV.PORT, () => {
    connectDB();
    console.log("Server is listening to port " + ENV.PORT)
})