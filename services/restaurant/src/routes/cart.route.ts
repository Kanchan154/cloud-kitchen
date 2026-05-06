import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { addToCart, clearCart, decrementItem, fetchCart, incrementItem, updateCart } from "../controllers/cart.controller.js";
const router = express.Router();

router.post('/add-to-cart', isAuth, addToCart);
router.get('/get-cart-items', isAuth, fetchCart);
router.delete('/clear-cart', isAuth, clearCart);
router.put('/update-cart', isAuth, updateCart);
router.put('/increase-quantity', isAuth, incrementItem);
router.put('/decrease-quantity', isAuth, decrementItem);

export default router;