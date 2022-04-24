import { Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { generateAccessToken, UserJwtPayload, verifyAccessToken } from '../jwt';
import { getTokenForUser } from '../tokenStore';

const refresh = async (req: Request, res: Response) => {
  const accessToken = req.cookies.jwt;

  if (!accessToken) {
    return res.status(403).send('JWT access token cookie not found.');
  }

  const payload = jwt.decode(accessToken);
  const { userId, username } = payload as UserJwtPayload;
  const refreshToken = getTokenForUser(userId);

  try {
    verifyAccessToken(refreshToken, 'refreshToken');
  } catch (e) {
    if (e instanceof TokenExpiredError || !refreshToken) {
      return res.status(401).send('Refresh token is not present or expired. Please login again.');
    }
    console.error(e);
    return res.status(401).send('Failed to generate access token using the refresh token.');
  }

  const newAccessToken = generateAccessToken(userId, username);
  res.cookie('jwt', newAccessToken, { secure: true, httpOnly: true });
  return res.status(200).send();
};

export default refresh;
