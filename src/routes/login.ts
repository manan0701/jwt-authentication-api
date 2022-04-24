import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { ValidationError } from 'joi';
import { generateJWTTokensForUser } from '../jwt';
import { findUserByUsername, LoginSchema, UserType } from '../model/user';
import { persistUserRefreshToken } from '../tokenStore';

const login = async (req: Request, res: Response) => {
  const validationError = validateRequest(req);

  if (validationError) {
    return res.status(400).send(`Failed to login the user: ${validationError.message}`);
  }

  const { username, password } = parseLoginInfoFromRequest(req);
  const user: UserType | null = await findUserByUsername(username);

  if (!user) {
    return res.status(400).send('User with the given username does not exist.');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Incorrect password for the user provided.');
  }

  const { accessToken, refreshToken } = generateJWTTokensForUser(user);
  persistUserRefreshToken(user, refreshToken);

  res.cookie('jwt', accessToken, { secure: true, httpOnly: true });
  res.status(200).send();
};

const validateRequest = (request: Request): ValidationError | null => {
  if (!request || !request.body) {
    return null;
  }
  const { username, password } = request.body;
  const { error } = LoginSchema.validate({ username, password });
  return error ? error : null;
};

const parseLoginInfoFromRequest = (request: Request): { username: string; password: string } => {
  const { username, password } = request.body;
  return { username, password };
};

export default login;
