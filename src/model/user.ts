import bcrypt from 'bcrypt';
import Joi from 'joi';
import { model, Schema } from 'mongoose';
import { AccessToken, generateAccessToken, generateRefreshToken, RefreshToken } from '../jwt';

/**
 * Type representing a user with fields to support type-safe data flow.
 */
type UserType = {
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  generateJwtAccessToken?: () => AccessToken;
  generateJwtRefreshToken?: () => RefreshToken;
};

const User = new Schema({
  first_name: { type: String, required: true, min: 1, max: 255 },
  last_name: { type: String, required: true, min: 1, max: 255 },
  username: { type: String, required: true, unique: true, min: 1, max: 255 },
  password: { type: String, required: true },
});

const RegisterSchema = Joi.object({
  first_name: Joi.string().alphanum().min(3).max(255).required(),
  last_name: Joi.string().alphanum().min(3).max(255).required(),
  username: Joi.string().min(1).alphanum().max(255).required(),
  password: Joi.string().min(1).max(255).required(),
});

const LoginSchema = Joi.object({
  username: Joi.string().alphanum().min(1).max(255).required(),
  password: Joi.string().alphanum().min(1).max(255).required(),
});

User.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

User.methods = {
  generateJwtAccessToken: function (): AccessToken {
    const { _id, username } = this;
    return generateAccessToken(_id, username);
  },
  generateJwtRefreshToken: function (): RefreshToken {
    const { _id, username } = this;
    return generateRefreshToken(_id, username);
  },
};

const UserModel = model('User', User);

const findUserByUsername = async (username: string): Promise<UserType | null> => {
  return await UserModel.findOne({ username: username });
};

export { UserModel as User, LoginSchema, RegisterSchema, UserType, findUserByUsername };
