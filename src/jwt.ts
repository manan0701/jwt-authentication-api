import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserType } from './model/user';

type AccessToken = string;

type RefreshToken = string;

type TokenTypes = 'accessToken' | 'refreshToken';

type JWTTokens = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
};

interface UserJwtPayload extends JwtPayload {
  userId: string;
  username: string;
}

const generateAccessToken = (userId: string, username: string): AccessToken => {
  const { ACCESS_TOKEN_KEY = '', ACCESS_TOKEN_EXPIRY = '10m' } = process.env;

  return jwt.sign({ userId, username }, ACCESS_TOKEN_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (userId: string, username: string): RefreshToken => {
  const { REFRESH_TOKEN_KEY = '', REFRESH_TOKEN_EXPIRY = '1d' } = process.env;

  return jwt.sign({ userId, username }, REFRESH_TOKEN_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const generateJWTTokensForUser = (user: UserType): JWTTokens => {
  let accessToken = '';
  let refreshToken = '';

  if (user.generateJwtAccessToken) {
    accessToken = user.generateJwtAccessToken();
  }

  if (user.generateJwtRefreshToken) {
    refreshToken = user.generateJwtRefreshToken();
  }
  return { accessToken, refreshToken };
};

const verifyAccessToken = (
  accessToken: AccessToken | RefreshToken,
  tokenType: TokenTypes
): JwtPayload | string => {
  const { ACCESS_TOKEN_KEY = '', REFRESH_TOKEN_KEY = '' } = process.env;

  let SECRET = '';
  if (tokenType == 'accessToken') {
    SECRET = ACCESS_TOKEN_KEY;
  } else if (tokenType == 'refreshToken') {
    SECRET = REFRESH_TOKEN_KEY;
  }

  return jwt.verify(accessToken, SECRET);
};

export {
  AccessToken,
  RefreshToken,
  JWTTokens,
  UserJwtPayload,
  generateJWTTokensForUser,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
};
