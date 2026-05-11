import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createOrder, fetchOrderForPayment } from "../controllers/order.controller.js";
const router = express.Router();

router.post('/new', isAuth, createOrder);
router.get('/payment/:orderId', fetchOrderForPayment)

export default router;