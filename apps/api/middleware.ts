import type {Response,Request,NextFunction} from "express";
import jwt from "jsonwebtoken";




export async function authMiddleware(req: Request, res: Response,next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "No token provided,so Unauthorized",

        })
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWKS_PUBLIC_KEY!);



    if (!decoded) {
        return res.status(401).json({
            error: "No token provided,so Unauthorized",
        })
    }

    req.userId  = decoded.sub as string;


    next()

}