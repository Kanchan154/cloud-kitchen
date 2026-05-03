import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { addToCart, clearCart, fetchCart, updateCart } from "../controllers/cart.controller.js";
const router = express.Router();

router.post('/add-to-cart', isAuth, addToCart);
router.post('/get-cart-items', isAuth, fetchCart);
router.delete('/clear-cart', isAuth, clearCart);
router.put('/update-cart', isAuth, updateCart);
export default router;