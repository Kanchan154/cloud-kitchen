import express from 'express'
import { isAuth, isSeller } from '../middleware/isAuth.js';
import { addRestaurant, fetchMyRestaurant, fetchSingleRestaurant, getNearByRestaurant, updateRestaurant, updateRestaurantStatus } from '../controllers/restaurant.controller.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();
router.post("/add-restaurant", isAuth, isSeller, uploadFile, addRestaurant);
router.get('/get-my-restaurant', isAuth, isSeller, fetchMyRestaurant);
router.put("/update-status", isAuth, isSeller, updateRestaurantStatus);
router.put("/update-restaurant", isAuth, isSeller, updateRestaurant);

router.get("/get-all", isAuth, getNearByRestaurant);
router.get('/get-restaurant/:id', isAuth, fetchSingleRestaurant);

export default router;