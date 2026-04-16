import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/ENV.js";

export interface IUSer {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    restaurantId: string
}

export interface AuthenticatedRequest extends Request {
    user?: IUSer | null;
}

// checking auth middleware
export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized, Please login" });
            return;
        }
        const token = authHeader.split(" ")[1]
        if (!token) {
            res.status(401).json({ message: "Unauthorized - Token missing" });
            return;
        };
        const decoded = jwt.verify(token, ENV.JWT_SECRET as string) as JwtPayload;

        if (!decoded || !decoded.user) {
            res.status(401).json({ message: "Unauthorized - Invalid token" });
            return;
        }

        req.user = decoded.user;
        next();
    } catch (error) {
        console.log("Error in auth middleware : " + error);
        next(error);
    }
}

export const isSeller = async(req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> =>{
    const user = req.user;
    if(user && user.role !== "seller"){
        res.status(401).json({message:"Unauthorized - User is not a seller"});
        return;
    }
    next();
}
