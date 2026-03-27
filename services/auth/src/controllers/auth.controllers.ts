import jwt from 'jsonwebtoken';
import TryCatch from "../middleware/trycatch.js";
import User from "../model/User.js";
import { ENV } from "../utils/ENV.js";
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { oauth2Client } from '../utils/googleConfig.js';
import axios from 'axios';

// login controller
export const loginUser = TryCatch(async (req, res, next) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ message: "Authorization code is required" });
        return;
    }
    // get the access token
    const googleResponse = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleResponse.tokens);

    const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)
    const { name, email, picture } = userResponse.data;

    // check if the fields are non-empty or not
    if (!(name && email && picture)) {
        res.status(400).json({ message: "All fields are required" });
    }
    // check if the user is already registered
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({ name, email, image: picture });
    }

    // creating JSONWebToken for the user who signs in the application
    const token = jwt.sign({ user }, ENV.JWT_SECRET as string, { expiresIn: '15d' });
    res.status(200).json({ message: "User logged in successfully", token, user });
});

const allowedRoles = ["customer", "seller", "rider"] as const;
type Role = typeof allowedRoles[number];

// choose role controller
export const addUserRole = TryCatch(async (req: AuthenticatedRequest, res) => {

    if (!req.user?._id) {
        res.status(400).json({ message: "Unauthorized - User Id not found" });
        return;
    }

    const role = req.body as { role: Role };

    // check if the role mentioned is valid or not
    if (!allowedRoles.includes(role.role)) {
        res.status(400).json({ message: "Invalid role" });
        return;
    }
    // update the user role
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { role: role.role }, { new: true });
    if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    // update the token value
    const token = jwt.sign({ user: updatedUser }, ENV.JWT_SECRET as string, { expiresIn: '15d' });
    res.status(200).json({ message: "User role updated successfully", user: updatedUser, token });
});

// check-auth controller
export const checkAuth = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user?._id) {
        res.status(400).json({ message: "Unauthorized - User Id not found" });
        return;
    }
    res.status(200).json({ message: "User authenticated successfully", user: req.user });
});
