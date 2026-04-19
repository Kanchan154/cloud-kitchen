import axios from "axios";
import getBuffer from "../config/dataUri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import RestaurantModel from "../models/restraurant.model.js";
import MenuItemModel from "../models/menu.model.js";
import { ENV } from "../config/ENV.js";

// add new menu item
export const addMenuItem = TryCatch(async (req: AuthenticatedRequest, res) => {
    // get the user
    if (!req.user) {
        return res.status(403).json({ message: "Unauthorized - User not found" });
    }
    // get the restaurant
    const restaurant = await RestaurantModel.findOne({ ownerId: req.user._id });

    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    // getting the input
    const { name, description, price } = req.body;
    if (!(name && price)) {
        return res.status(400).json({ message: "Name and price are required" });
    }

    // getting the file
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Image is required" });
    }

    // creating file buffer
    const fileBuffer = getBuffer(file);
    if (!fileBuffer?.content) {
        return res.status(500).json({ message: "Failed to create file buffer" });
    }

    // upload image to cloudinary
    try {
        const { data: uploadResult } = await axios.post(`${ENV.UTILS_URI}/api/cloud/upload`, {
            buffer: fileBuffer.content,
        }, {
            timeout: 30000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        // getting the upload url
        if (!uploadResult?.url) {
            return res.status(500).json({ message: "Failed to upload image to cloudinary" });
        }
        // create a new menuItem
        const menuItem = await MenuItemModel.create({
            restaurantId: restaurant._id,
            name,
            description,
            image: uploadResult.url,
            price
        })

        res.status(201).json({ message: "Item added successfully", menuItem });
    } catch (uploadError: any) {
        const upstreamMessage = uploadError?.response?.data?.message || uploadError?.response?.data?.error;
        console.error("Cloudinary upload error:", uploadError.message, upstreamMessage || "");
        return res.status(500).json({
            message: "Failed to upload image to cloudinary",
            error: upstreamMessage || uploadError.message
        });
    }
})

// get all menu items
export const getAllMenuItems = TryCatch(async (req: AuthenticatedRequest, res) => {
    // get id of restaurant
    const { id } = req.params;
    if (!id) return res.status(404).json({ message: "Restaurant not found" });

    // getting the menu items
    const items = await MenuItemModel.find({ restaurantId: id });
    res.status(200).json({ items });
})

// delete menu item
export const deleteMenuItem = TryCatch(async (req: AuthenticatedRequest, res) => {
    // check if user is authenticated
    if (!req.user) return res.status(403).json({ message: "Unauthorized - User not found" });
    const { id } = req.params;
    // check the id of the item
    if (!id) return res.status(404).json({ message: "Item not found" });
    const item = await MenuItemModel.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    // check for the restaurant
    const restaurant = await RestaurantModel.findOne({ ownerId: req.user._id, _id: item.restaurantId });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // check if the user is the owner of the item
    if (item.restaurantId.toString() !== req.user?.restaurantId) return res.status(403).json({ message: "Unauthorized - User is not the owner of this item" });

    await MenuItemModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
})

// toggle Availability of the menu item
export const toggleMenuItemAvailability = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) return res.status(403).json({ message: "Unauthorized - User not found" });
    const { id } = req.params;

    // get the menu item
    const item = await MenuItemModel.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // check for the restaurant
    const restaurant = await RestaurantModel.findOne({ ownerId: req.user._id, _id: item.restaurantId });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // check if the user is the owner of the item
    if (item.restaurantId.toString() !== req.user?.restaurantId) return res.status(403).json({ message: "Unauthorized - User is not the owner of this item" });

    // toggle availability
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.status(200).json({ message: `${item.name} is marked as ${item.isAvailable ? "available" : "not available"}`, item });
})

