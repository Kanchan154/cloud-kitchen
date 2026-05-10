import mongoose, { Document } from "mongoose";

export interface IOrder extends Document {
    userId: string;
    restaurantId: string;
    restaurantName: string;
    riderId?: string | null;
    riderPhone: number | null;
    riderName: string | null;
    distance: number;
    riderAmount: number;

    items: {
        itemId: string;
        name: string;
        price: number;
        quantity: number;
    }[];

    subTotal: number;
    deliveryFee: number;
    taxes: number;
    total: number;
    addressId: string;
    deliveryAddress: {
        formattedAddress: string;
        moble: number;
        latitute: number;
        longitude: number;
    }
    status: | "placed" | "accepted" | "preapring" | "ready_for_rider" | "rider_assigned" | "picked_up" | "delivered" | "cancelled";
    paymentMethod: "razorpay" | "stripe";
    paymentStatus: "pending" | "paid" | "failed";
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>({
    userId: {
        type: String,
        required: true
    },
    restaurantId: {
        type: String,
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    riderId: {
        type: String,
        default: null
    },
    riderPhone: {
        type: Number,
        default: null
    },
    riderName: {
        type: String,
        default: null
    },
    distance: {
        type: Number,
        required: true,
        default: 0
    },
    riderAmount: {
        type: Number,
        required: true
    },
    items: [
        {
            itemId: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    subTotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    taxes: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    addressId: {
        type: String,
        required: true
    },
    deliveryAddress: {
        formattedAddress: {
            type: String,
            required: true
        },
        moble: {
            type: Number,
            required: true
        },
        latitute: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ["placed", "accepted", "preapring", "ready_for_rider", "rider_assigned", "picked_up", "delivered", "cancelled"],
        default: "placed"
    },
    paymentMethod: {
        type: String,
        enum: ["razorpay", "stripe"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
export default OrderModel;
