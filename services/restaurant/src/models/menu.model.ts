import mongoose, { Document } from "mongoose";

export interface IMenuItem extends Document {
    restaurantId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    image?: string; 
    price: number;
    isAvailable: boolean;
    createdAt: Date
    updatedAt: Date
}

const MenuSchema = new mongoose.Schema<IMenuItem>({
    restaurantId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Restaurant",
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: false
    },
}, {timestamps: true});

const MenuItemModel = mongoose.model<IMenuItem>("MenuItem", MenuSchema);
export default MenuItemModel;