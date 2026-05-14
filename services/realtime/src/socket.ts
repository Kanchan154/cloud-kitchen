import { Server } from "socket.io";
import http from 'http';
import jwt from 'jsonwebtoken';
import { ENV } from "./config/ENV.js";

let io: Server;

export const innitSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Unauthorized"));
            }
            const decoded = jwt.verify(token, ENV.JWT_SECRET!) as jwt.JwtPayload;
            if (!decoded || !decoded.user) {
                return next(new Error("Unauthorized"));
            }
            socket.data.user = decoded.user;
            next();
        } catch (error) {
            console.log("🔴 Socket Auth failed")
            next(new Error("Unauthorized"));
        }
    })
    io.on("connection", (socket) => {
        const user = socket.data.user;
        if (!user) {
            socket.disconnect();
            return;
        };
        const userId = user._id;
        socket.join(`user connected: ${userId.toString()}`);
        if (user.restaurantId) {
            socket.join(`restaurant connected: ${user.restaurantId.toString()}`);
        }
        console.log(`User connected: ${userId}`)
        console.log("Socket Room", [...socket.rooms]);

        socket.on("disconnect", () => {
            console.log("User disconnected:", userId)
        })
    })
    return io;
}

export const getIO = () => {
    if(!io){
        throw new Error("Socket is not initialized");
    }
    return io;
}