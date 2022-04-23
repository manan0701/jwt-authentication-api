import 'dotenv/config';
import { Request, Response } from 'express';
import { findUserByUsername, User, UserType } from '../model/user';
import { persistUserRefreshToken } from '../tokenStore';

const register = async (req: Request, res: Response) => {
  const user = parseUserInfoFromRequest(req);

  if (!user) {
    return res
      .status(400)
      .send(
        'Sufficient information not found for user registration. Please provide valid first name, last name, unique username, and password.'
      );
  }

  if (await findUserByUsername(user.username)) {
    return res
      .status(409)
      .send('User with the given username already exist. Please login instead.');
  }

  const persistentUser = await registerUser(user);
  let accessToken = '';
  let refreshToken = '';

  if (persistentUser.generateJwtAccessToken) {
    accessToken = persistentUser.generateJwtAccessToken();
  }

  if (persistentUser.generateJwtRefreshToken) {
    refreshToken = persistentUser.generateJwtRefreshToken();
  }

  persistUserRefreshToken(user, refreshToken);

  res.cookie('jwt', accessToken, { secure: true, httpOnly: true });
  res.status(201).send();
};

const parseUserInfoFromRequest = (request: Request): UserType | null => {
  if (!request || !request.body) {
    return null;
  }

  const { first_name, last_name, username, password } = request.body;

  if (!(first_name && last_name && username && password)) {
    return null;
  }

  return { firstName: first_name, lastName: last_name, username: username, password: password };
};

const registerUser = async (user: UserType): Promise<UserType> => {
  return await User.create({
    first_name: user.firstName,
    last_name: user.lastName,
    username: user.username,
    password: user.password,
  });
};

export default register;
