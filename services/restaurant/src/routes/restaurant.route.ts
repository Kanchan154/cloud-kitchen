import express from 'express'
import { isAuth, isSeller } from '../middleware/isAuth.js';
import { addRestaurant } from '../controllers/restaurant.controller.js';

const router = express.Router();
router.post("/add-restaurant", isAuth, isSeller, addRestaurant);

export default router;