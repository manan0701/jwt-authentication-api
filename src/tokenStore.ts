import { UserType } from './model/user';

interface RefreshToken {
  [id: string]: string;
}

const tokens: RefreshToken = {};

const persistUserRefreshToken = (user: UserType, refreshToken: string) => {
  if (user._id) {
    tokens[user._id] = refreshToken;
  }
};

export { persistUserRefreshToken };
