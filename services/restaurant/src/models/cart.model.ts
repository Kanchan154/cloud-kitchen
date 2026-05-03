import mongoose, { Document, Schema } from "mongoose";

export interface Icart extends Document {
    userId: mongoose.Types.ObjectId;
    restaurantId: mongoose.Types.ObjectId;
    itemId: mongoose.Types.ObjectId;
    quantity: number;
    createdAt: Date;
    updatedAt: Date
}

const CartSchema = new mongoose.Schema<Icart>({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
        index: true
    },
    restaurantId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Restaurant",
        index: true
    },
    itemId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "MenuItem",
        index: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    }
}, { timestamps: true });

CartSchema.index({ userId: 1, restaurantId: 1, itemId: 1 }, { unique: true })

const CartModel = mongoose.model<Icart>("Cart", CartSchema);
export default CartModel;