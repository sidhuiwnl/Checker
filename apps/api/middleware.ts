import type {Response,Request,NextFunction} from "express";
import jwt from "jsonwebtoken";




export async function authMiddleware(req: Request, res: Response,next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            error: "No token provided,so Unauthorized",

        })
        return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWKS_PUBLIC_KEY!);



    if (!decoded) {
        res.status(401).json({
            error: "No token provided,so Unauthorized",
        })
        return;
    }

    req.userId  = decoded.sub as string;


    next()

}