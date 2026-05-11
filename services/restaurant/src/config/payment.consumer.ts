import OrderModel from '../models/orders.model.js';
import { ENV } from './ENV.js';
import { getChannel } from './rabbitMQ.js';

export const startPaymentConsumer = async () => {
    const channel = getChannel();

    channel.consume(ENV.PAYMENT_QUEUE!, async (msg) => {
        if (!msg) return;
        try {
            const event = JSON.parse(msg.content.toString());

            if (event.type !== "PAYMENT_SUCCESS") {
                channel.ack(msg);
                return;
            }
            const { orderId } = event.data;
            const order = await OrderModel.findOneAndUpdate({
                _id: orderId,
                paymentStatus: { $ne: "paid" }
            }, {
                $set: {
                    paymentStatus: "paid",
                    status: "placed"
                },
                $unset: {
                    expiresAt: 1
                }
            },
                { returnDocument: 'after' }
            )
            if (!order) {
                channel.ack(msg);
                return;
            }

            console.log({ message: "Order created successfully", orderId: order._id.toString() });


            // socket - todo
        } catch (error) {
            console.error("🔴Error in payment consumer", error);
        }
    })
}