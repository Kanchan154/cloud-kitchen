import crypto from 'crypto';
import { ENV } from './ENV.js';
export const verifyRazorpaySignature = (
    orderId: string,
    paymentId: string,
    signature: string
) => {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');
    return signature === expectedSignature;
}