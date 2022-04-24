import 'dotenv/config';
import { Request, Response } from 'express';
import { ValidationError } from 'joi';
import { generateJWTTokensForUser } from '../jwt';
import { findUserByUsername, User, RegisterSchema, UserType } from '../model/user';
import { persistUserRefreshToken } from '../tokenStore';

const register = async (req: Request, res: Response) => {
  const validationError = validateRequest(req);

  if (validationError) {
    return res.status(400).send(`Failed to register the user: ${validationError.message}`);
  }

  const user = parseUserInfoFromRequest(req);

  if (await findUserByUsername(user.username)) {
    return res
      .status(409)
      .send('User with the given username already exist. Please login instead.');
  }

  const persistentUser = await registerUser(user);
  const { accessToken, refreshToken } = generateJWTTokensForUser(persistentUser);
  persistUserRefreshToken(user, refreshToken);

  res.cookie('jwt', accessToken, { secure: true, httpOnly: true });
  res.status(201).send();
};

const validateRequest = (request: Request): ValidationError | null => {
  if (!request || !request.body) {
    return null;
  }

  const { first_name, last_name, username, password } = request.body;

  const { error } = RegisterSchema.validate({ first_name, last_name, username, password });
  return error ? error : null;
};

const parseUserInfoFromRequest = (request: Request): UserType => {
  const { first_name, last_name, username, password } = request.body;
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
