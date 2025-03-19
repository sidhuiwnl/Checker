import type {Response,Request,NextFunction} from "express";
import jwt from "jsonwebtoken";


const JWT_SECRET = "sidharth";


export async function authMiddleware(req: Request, res: Response,next: NextFunction) {
    const authHeader = req.headers.authorization;

    // if (!authHeader) {
    //     return res.status(401).json({
    //         error: "No token provided",
    //
    //     })
    // }
    //
    // const token = authHeader.split(' ')[1];
    //
    // const decoded = jwt.verify(token, JWT_SECRET);
    //
    // const userId = decoded.

    req.userId = "1"
    next()

}