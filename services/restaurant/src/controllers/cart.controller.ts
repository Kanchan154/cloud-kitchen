import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import CartModel from "../models/cart.model.js";

export const addToCart = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
        return res.status(403).json({ message: "Unauthorized - User not found" });
    }

    const userId = req.user._id;
    const { restaurantId, itemId } = req.body;
    // check for restaurant and item id
    if (!(mongoose.Types.ObjectId.isValid(restaurantId) && mongoose.Types.ObjectId.isValid(itemId))) {
        return res.status(400).json({ message: "Invalid restaurantId or itemId" });
    }

    // check is the user has something in cart from different restaurant
    const cartFromDifferentRestaurant = await CartModel.findOne({ userId, restaurantId: { $ne: restaurantId } });
    if (cartFromDifferentRestaurant) {
        return res.status(400).json({ message: "You have something in cart from different restaurant, Please clear your cart first." });
    }
    const cartItem = await CartModel.findOneAndUpdate(
        { userId, itemId, restaurantId },
        {
            $inc: { quantity: 1 },
            $setOnInsert: { userId, restaurantId, itemId }
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    return res.status(200).json({ message: "Item added to cart successfully", cart: cartItem });
})

export const fetchCart = TryCatch(async (req: AuthenticatedRequest, res) => {
    const id = req.user?._id;
    if (!id) {
        return res.status(403).json({ message: "Unauthorized - User not found" });
    }
    const cartItems = await CartModel.find({ userId: id }).populate("itemId").populate("restaurantId");

    let subTotal = 0;
    let cartLength = 0;

    for (const cartItem of cartItems) {
        const item: any = cartItem.itemId;
        subTotal += cartItem.quantity * item.price;
        cartLength += cartItem.quantity;
    }
    return res.status(200).json({ message: "Cart fetched successfully", cart: cartItems, subTotal, cartLength });
})

export const clearCart = TryCatch(async (req: AuthenticatedRequest, res) => {
    const id = req.user?._id;
    if (!id) {
        return res.status(403).json({ message: "Unauthorized - User not found" });
    }
    await CartModel.deleteMany({ userId: id });
    return res.status(200).json({ message: "Cart cleared successfully" });
})

export const updateCart = TryCatch(async (req: AuthenticatedRequest, res) => {

})

// increment item
export const incrementItem = TryCatch(async (req: AuthenticatedRequest, res) => {
    const id = req.user?._id;
    if (!id) {
        return res.status(403).json({ message: "Unauthorized - User not found" });
    }
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ message: "Item id is required" })

    await CartModel.findOneAndUpdate(
        { userId: id, itemId },
        { $inc: { quantity: 1 } },
        { returnDocument: 'after' }
    )
    return res.status(200).json({ message: "Item quantity updated successfully" });
})

// decrement item
export const decrementItem = TryCatch(async (req: AuthenticatedRequest, res) => {
    const id = req.user?._id;
    if (!id) {
        return res.status(403).json({ message: "Unauthorized - User not found" });
    }
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ message: "Item id is required" })

    // if the item quantity is 1, delete the item
    const cartItem = await CartModel.findOne({ userId: id, itemId });
    if (!cartItem) return res.status(404).json({ message: "Item not found in cart" });
    if (cartItem.quantity === 1) {
        await CartModel.findByIdAndDelete(cartItem._id);
        return res.status(200).json({ message: "Item removed from cart successfully" });
    }
    await CartModel.findOneAndUpdate(
        { userId: id, itemId },
        { $inc: { quantity: -1 } },
        { returnDocument: 'after' }
    );
    return res.status(200).json({ message: "Item quantity updated successfully" });
})