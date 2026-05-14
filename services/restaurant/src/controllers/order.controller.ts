import { ENV } from "../config/ENV.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import AddressModel from "../models/address.model.js";
import CartModel from "../models/cart.model.js";
import { IMenuItem } from "../models/menu.model.js";
import OrderModel from "../models/orders.model.js";
import RestaurantModel, { IRestaurant } from "../models/restraurant.model.js";

export const createOrder = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) return res.status(403).json({ message: "Unauthorized - User not found" });

    const { paymentMethod, addressId, distance } = req.body;
    if (!addressId) return res.status(400).json({ message: "Address id is required" });

    // fetching address
    const address = await AddressModel.findById(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // fetching cart details
    const cartItems = await CartModel.find({ userId: user._id }).populate<{ itemId: IMenuItem }>("itemId").populate<{ restaurantId: IRestaurant }>("restaurantId");
    if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const firstCartItem = cartItems[0];
    if (!firstCartItem || !firstCartItem.restaurantId) return res.status(400).json({ message: "Cart is empty" });

    const restaurantId = firstCartItem.restaurantId._id;
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) return res.status(400).json({ message: "No restaurant found" });
    if (!restaurant.isOpen) return res.status(400).json({ message: "Sorry, Restaurant is closed for now" });

    let subTotal = 0
    // getting the  subtotal for the order
    const orderItems = cartItems.map((cartItem) => {
        const item = cartItem.itemId;
        if (!item) throw new Error("Invalid cart item");
        subTotal += cartItem.quantity * item.price;
        return {
            itemId: item._id.toString(),
            name: item.name,
            price: item.price,
            quantity: cartItem.quantity
        };
    });

    // calculating the fee
    const deliveryFee = subTotal >= 500 ? 0 : 50;
    const tax = subTotal * 0.05;
    const total = subTotal + deliveryFee + tax;

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const [latitute, longitude] = address.location.coordinates;

    const riderAmount = Math.ceil(distance) * 10;

    // now creating the order
    const order = await OrderModel.create({
        userId: user._id,
        restaurantId: restaurantId.toString(),
        restaurantName: restaurant.name,
        riderId: null,
        items: orderItems,
        subTotal,
        deliveryFee,
        taxes: tax,
        distance,
        riderAmount,
        total,
        addressId: address._id.toString(),
        deliveryAddress: {
            formattedAddress: address.formattedAddress,
            mobile: address.mobile,
            latitute,
            longitude
        },
        paymentMethod,
        paymentStatus: "pending",
        status: "placed",
        expiresAt,
    })
    return res.status(200).json({ message: "Order created successfully", orderId: order._id.toString(), amount: total });
});

export const fetchOrderForPayment = TryCatch(async (req, res) => {
    if (req.headers["x-internal-key"] !== ENV.INTERNAL_SERVICE_KEY) {
        return res.status(403).json({ message: "Forbidden" })
    }
    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: "Order not found" })
    }
    if (order.paymentStatus !== "pending") return res.status(400).json({ message: "Order already paid" });

    res.json({
        orderId: orderId,
        amount: order.total,
        currency: "INR"
    })
})

// get all orders
export const fetchOrders = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) return res.status(403).json({ message: "Unauthorized - User not found" });
    const orders = await OrderModel.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
})