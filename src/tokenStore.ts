import { RefreshToken } from './jwt';
import { UserType } from './model/user';

interface RefreshTokens {
  [userId: string]: RefreshToken;
}

const tokens: RefreshTokens = {};

const persistUserRefreshToken = (user: UserType, refreshToken: RefreshToken) => {
  if (user._id) {
    tokens[user._id] = refreshToken;
  }
};

const getTokenForUser = (userId: string): RefreshToken => {
  return tokens[userId];
};

export { persistUserRefreshToken, getTokenForUser };
