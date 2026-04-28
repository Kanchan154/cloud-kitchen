import axios from "axios";
import getBuffer from "../config/dataUri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import RestaurantModel from "../models/restraurant.model.js";
import { ENV } from "../config/ENV.js";
import jwt from "jsonwebtoken";

// add restaurant
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
    try {
        const { data: uploadResult } = await axios.post(`${ENV.UTILS_URI}/api/cloud/upload`, {
            buffer: fileBuffer.content,
        }, {
            timeout: 300000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
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
    } catch (uploadError: any) {
        const upstreamMessage = uploadError?.response?.data?.message || uploadError?.response?.data?.error;
        console.error("Cloudinary upload error:", uploadError.message, upstreamMessage || "");
        return res.status(500).json({
            message: "Failed to upload image to cloudinary",
            error: upstreamMessage || uploadError.message
        });
    }
})

// fetch my restaurant
export const fetchMyRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    // fetch restaurant
    const restaurant = await RestaurantModel.findOne({ ownerId: req.user._id });
    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    if (!req.user?.restaurantId) {
        const token = jwt.sign({
            user: {
                ...req.user,
                restaurantId: restaurant._id
            }
        }, ENV.JWT_SECRET as string, { expiresIn: '15d' });
        res.status(200).json({ message: "Restaurant fetched successfully", restaurant, token });
    }
    res.json({ message: "Restaurant fetched successfully", restaurant });
})

// update restaurant status
export const updateRestaurantStatus = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
        return res.status(403).json({ message: "Unauthorized - User not found" });
    }
    const { status } = req.body;
    if (typeof status !== "boolean") {
        return res.status(400).json({ message: "Status must be a boolean" });
    }

    const restaurant = await RestaurantModel.findOneAndUpdate(
        { ownerId: req.user._id },
        { $set: { isOpen: status } },
        { new: true }
    )

    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant status updated successfully", restaurant });
})

// update restaurant details
export const updateRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
        return res.status(403).json({ message: "Unauthorized - User not found" });
    }
    const data = req.body;
    const restaurant = await RestaurantModel.findOneAndUpdate(
        { ownerId: req.user._id },
        { $set: data },
        { new: true }
    )
    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant updated successfully", restaurant });
})

// get nearby restaurant
export const getNearByRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    // get the location of the user
    const { latitude, longitude, radius = 5000, search = "" } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const query: any = {
        isVerified: true
    }
    if (search && typeof search === "string") {
        query.name = { $regex: search, $optiions: "i" };
    }
    // get the list of restaurants
    const restaurants = await RestaurantModel.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [Number(longitude), Number(latitude)]
                },
                distanceField: "distance",
                maxDistance: Number(radius),
                query,
                spherical: true,
            }
        },
        {
            $sort: {
                isOpen: -1,
                distance: 1
            }
        },
        {
            $addFields: {
                distanceKm: {
                    $round: [{ $divide: ["$distance", 1000] }, 2]
                }
            }
        }
    ]);

    res.status(200).json({ restaurants, count: restaurants.length });
})

// fetch single restaurant
export const fetchSingleRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const restaurant = await RestaurantModel.findById(id);
    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ restaurant });
})
