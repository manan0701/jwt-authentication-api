import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';


const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.jwt;

    if (!accessToken) {
        return res.status(403).send('JWT access token cookie not found.');
    }

    const { ACCESS_TOKEN_KEY = '' } = process.env;

    try {
        jwt.verify(accessToken, ACCESS_TOKEN_KEY);
        next();
    } catch (e) {
        console.error(e);
        return res.status(401).send("Failed to authenticate user using the given JWT cookie.");
    }
};

export default verifyAccessToken;