import express, { Request, Response, NextFunction } from "express";
import { ENV } from "./config/ENV.js";
import cloudinary from "cloudinary";
import cors from 'cors'

import uploadRoute from './routes/cloudinary.js';
const app = express();


if (!ENV.CLOUD_NAME || !ENV.CLOUD_API_KEY || !ENV.CLOUD_SECRET_KEY) {
    throw new Error("Missing Cloudinary credentials");
}

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Increase server timeout for Cloudinary uploads
app.use((req, res, next) => {
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000); // 5 minutes
    next();
});

// Increase server timeout for Cloudinary uploads
app.use((req, res, next) => {
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000); // 5 minutes
    next();
});


cloudinary.v2.config({
    cloud_name: ENV.CLOUD_NAME,
    api_key: ENV.CLOUD_API_KEY,
    api_secret: ENV.CLOUD_SECRET_KEY
})

app.use("/api/cloud", uploadRoute);


// Error route
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ENV.NODE_ENV === "development" ? res.status(500).json({ message: err.message }) : res.status(500).json({ message: "Something went wrong" });
})
app.listen(ENV.PORT, () => {
    console.log(`Utils server is listening to Port: ${ENV.PORT}`)
})