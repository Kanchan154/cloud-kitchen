import axios from "axios";
import getBuffer from "../config/dataUri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import RestaurantModel from "../models/restraurant.model.js";
import { ENV } from "../config/ENV.js";

export const addRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    const existingRestaurant = await RestaurantModel.findOne({
        ownerId: user._id
    })

    if (existingRestaurant) {
        return res.status(400).json({ message: "You already have a restaurant" });
    }

    // getting the input
    const { name, description, latitude, longitude, formattedAddress, phone } = req.body;

    if (!name || !description || !latitude || !longitude || !formattedAddress || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // getting the image
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Image is required" });
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer?.content) {
        return res.status(500).json({ message: "Failed to create file buffer" });
    }

    // upload image to cloudinary
    const { data: uploadResult } = await axios.post(`${ENV.UTILS_URI}/api/cloud/upload`, {
        buffer: fileBuffer.content,
    });

    if (!uploadResult?.url) {
        return res.status(500).json({ message: "Failed to upload image to cloudinary" });
    }

    // create a new restaurant
    const restaurant = await RestaurantModel.create({
        ownerId: user._id,
        name,
        description,
        image: uploadResult.url,
        phone,
        autoLocation: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
            formattedAddress
        }
    });
    res.status(201).json({ message: "Restaurant created successfully", restaurant });
})