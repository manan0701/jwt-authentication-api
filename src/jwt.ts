import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserJwtPayload extends JwtPayload {
  userId: string;
  username: string;
}

const generateAccessToken = (userId: string, username: string): string => {
  const { ACCESS_TOKEN_KEY = '', ACCESS_TOKEN_EXPIRY = '10m' } = process.env;

  return jwt.sign({ userId, username }, ACCESS_TOKEN_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (userId: string, username: string): string => {
  const { REFRESH_TOKEN_KEY = '', REFRESH_TOKEN_EXPIRY = '1d' } = process.env;

  return jwt.sign({ userId, username }, REFRESH_TOKEN_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const verifyAccessToken = (accessToken: string): JwtPayload | string => {
  const { ACCESS_TOKEN_KEY = '' } = process.env;
  return jwt.verify(accessToken, ACCESS_TOKEN_KEY);
};

export { UserJwtPayload, generateAccessToken, generateRefreshToken, verifyAccessToken };
