import express from 'express'
import { isAuth, isSeller } from '../middleware/isAuth.js';
import { addRestaurant, fetchMyRestaurant } from '../controllers/restaurant.controller.js';

const router = express.Router();
router.post("/add-restaurant", isAuth, isSeller, addRestaurant);
router.get('/get-my-restaurant', isAuth, isSeller, fetchMyRestaurant);

export default router;