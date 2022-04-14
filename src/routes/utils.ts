import jwt from 'jsonwebtoken';
import { UserType } from '../model/user';

const generateJwtAccessTokenForUser = (user: UserType): string => {
  const { ACCESS_TOKEN_KEY = '', ACCESS_TOKEN_EXPIRY = '1h' } = process.env;

  return jwt.sign({ user_id: user._id, username: user.username }, ACCESS_TOKEN_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export { generateJwtAccessTokenForUser };
