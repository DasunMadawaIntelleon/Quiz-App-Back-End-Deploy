import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';


const authenticate = (req:Request, res:Response, next:NextFunction) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY||"u606aDawnmeMVMgxesY2Dvf55DXrqtl3", (err:any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        next();
    });
};

export default authenticate;
