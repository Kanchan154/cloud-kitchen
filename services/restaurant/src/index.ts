import express, { Request, Response, NextFunction } from 'express';

import { ENV } from './config/ENV.js';
import connectDB from './config/db.js';
import restaurantRoute from './routes/restaurant.route.js'
import menuItemRoute from './routes/menuItem.route.js';
import cartRoute from "./routes/cart.route.js";

const app = express();

app.use(express.json());
app.use("/api/restaurant", restaurantRoute);
app.use('/api/restaurant/menu-item', menuItemRoute);
app.use('/api/restaurant/cart', cartRoute);

// Error route
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ENV.NODE_ENV === "development" ? res.status(500).json({ message: err.message }) : res.status(500).json({ message: "Something went wrong" });
})
app.listen(ENV.PORT, () => {
    connectDB();
    console.log(" Restaurant Server is listening to port " + ENV.PORT)
})