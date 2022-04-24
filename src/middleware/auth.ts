import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { AccessToken, verifyAccessToken } from '../jwt';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.jwt as AccessToken;

  if (!accessToken) {
    return res.status(403).send('JWT access token cookie not found.');
  }

  try {
    verifyAccessToken(accessToken, 'accessToken');
    next();
  } catch (e: unknown) {
    if (e instanceof TokenExpiredError) {
      return res.status(401).send('JWT access token is expired. Please login again.');
    }
    console.error(e);
    return res.status(401).send('Failed to authenticate user using the given JWT cookie.');
  }
};

export default authenticate;
