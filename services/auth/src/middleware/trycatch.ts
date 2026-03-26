import { Request, Response, RequestHandler, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";

const TryCatch = (handler: RequestHandler) => {
    return expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error: any) {
            console.log("Error : " + error);
            next(error);
        }
    })
}

export default TryCatch;