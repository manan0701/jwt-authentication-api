import jwt from 'jsonwebtoken';
import { UserType, User } from './model/user';

const generateJwtAccessTokenForUser = (user: UserType): string => {
  const { ACCESS_TOKEN_KEY = '', ACCESS_TOKEN_EXPIRY = '1h' } = process.env;

  return jwt.sign({ user_id: user._id, username: user.username }, ACCESS_TOKEN_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const findUserByUsername = async (username: string): Promise<UserType | null> => {
  return await User.findOne({ username: username });
};

export { generateJwtAccessTokenForUser, findUserByUsername };
