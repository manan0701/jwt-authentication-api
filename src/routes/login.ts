import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UserType } from '../model/user';
import { findUserByUsername, generateJwtAccessTokenForUser } from './utils';

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return res.status(400).send('Valid username and password for the user is required for login.');
  }

  const user: UserType | null = await findUserByUsername(username);

  if (!(user && (await bcrypt.compare(password, user.password)))) {
    return res.status(400).send('Incorrect login credentials provided.');
  }

  const accessToken = generateJwtAccessTokenForUser(user);

  res.cookie('jwt', accessToken, { secure: true, httpOnly: true });
  res.status(200).send();
};

export default login;