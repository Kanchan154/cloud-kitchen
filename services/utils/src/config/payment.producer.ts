import { ENV } from "./ENV.js";
import { getChannel } from "./rabbitmq.js";

export const publishPaymentSuccess = async (payload: {
    orderId: string;
    paymentId: string;
    provider: "razorpay" | "stripe";
}) => {
    const channel = getChannel();

    channel.sendToQueue(ENV.PAYMENT_QUEUE!, Buffer.from(JSON.stringify({
        type: "PAYMENT_SUCCESS",
        payload
    })),
        { persistent: true }
    )
}