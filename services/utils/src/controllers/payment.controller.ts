import axios from "axios";
import { Request, Response } from "express"
import { ENV } from "../config/ENV.js";
import { razorpay } from "../config/razorpay.js";
import { verifyRazorpaySignature } from "../config/verifyRazorpay.js";
import { publishPaymentSuccess } from "../config/payment.producer.js";

// create razorpay order controller
export const createRazorpayOrder = async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const { data } = await axios.get(`${ENV.RESTAURANT_SERVICE_URL}/order/payment/${orderId}`, {
        headers: {
            "x-internal-key": ENV.INTERNAL_SERVICE_KEY
        }
    });
    // create razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount: data.amount * 100,
        currency: "INR",
        receipt: orderId
    });
    res.json({
        razorpayOrderId: razorpayOrder.id,
        key: ENV.RAZORPAY_KEY_ID
    });
}

// verify razorpay payment
export const verifyRazorpayPayment = async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId)
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) return res.status(400).json({ message: "Payment verification failed" });

    await publishPaymentSuccess({
        orderId,
        paymentId: razorpay_payment_id,
        provider: "razorpay"
    })

    res.status(200).json({ message: "Payment verified successfully 🎉" });
}