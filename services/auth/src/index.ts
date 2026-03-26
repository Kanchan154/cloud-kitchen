import express, { Request, Response, NextFunction } from 'express';

import { ENV } from './utils/ENV.js';
import connectDB from './utils/db.js';

// importing the routes
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);       // auth route


// Error route
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ENV.NODE_ENV === "development" ? res.status(500).json({ message: err.message }) : res.status(500).json({ message: "Something went wrong" });
})

app.listen(ENV.PORT, () => {
    connectDB();
    console.log(`Server running on port ${ENV.PORT}`)
});