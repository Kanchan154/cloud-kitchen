import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import AddressModel from "../models/address.model.js";

export const addAddress = TryCatch(async (req: AuthenticatedRequest, res) => {
    const id = req.user?._id;
    if (!id) return res.status(401).json({ message: "Unauthorized - User not found" });

    const { formattedAddress, mobile, latitude, longitude } = req.body;

    if (!formattedAddress || !mobile || !latitude || !longitude) return res.status(400).json({ message: "All fields are required" });

    // add address to the database
    const address = await AddressModel.create({
        userId: id,
        formattedAddress,
        mobile,
        location: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)]
        }
    });

    return res.status(201).json({ message: "Address added successfully", address });
})

export const deleteAddress = TryCatch(async (req: AuthenticatedRequest, res) => {
    const id = req.user?._id;
    if (!id) return res.status(401).json({ message: "Unauthorized - User not found" });

    const { addressId } = req.params;
    if (!addressId) return res.status(400).json({ message: "Address id is required" });

    const deletedAddress = await AddressModel.findOneAndDelete(
        { _id: addressId, userId: id }
    );

    if (!deletedAddress) return res.status(404).json({ message: "Address not found" });

    return res.status(200).json({ message: "Address deleted successfully" });
})

export const getAllAddresses = TryCatch(async (req: AuthenticatedRequest, res) => {
    const id = req.user?._id;
    if (!id) return res.status(401).json({ message: "Unauthorized - User not found" });

    const addresses = await AddressModel.find({ userId: id }).sort({ createdAt: -1 });
    return res.status(200).json({ message: "Addresses fetched successfully", addresses });
})