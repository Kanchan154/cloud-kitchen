import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

import { IUSer } from "../model/User.js";
import { ENV } from "../utils/ENV.js";

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
