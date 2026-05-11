import amqp from "amqplib";
import { ENV } from "./ENV.js";
let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(ENV.RABBITMQ_URL!);

        channel = await connection.createChannel();
        await channel.assertQueue(ENV.PAYMENT_QUEUE!, {
            durable: true
        });
        console.log("🐇 Connected to RabbitMQ🐰");
    } catch (error) {
        console.log("Unable to connect to rabbit MQ" + error)
    }
}

export const getChannel = () => channel;