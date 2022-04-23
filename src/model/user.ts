import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

/**
 * Type representing a user with fields to support type-safe data flow.
 */
type UserType = {
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  generateJwtAccessToken?: () => string;
};

const UserSchema = new Schema({
  first_name: { type: String, required: true, min: 1, max: 255 },
  last_name: { type: String, required: true, min: 1, max: 255 },
  username: { type: String, required: true, unique: true, min: 1, max: 255 },
  password: { type: String, required: true },
});

UserSchema.methods = {
  generateJwtAccessToken: function (): string {
    const { ACCESS_TOKEN_KEY = '', ACCESS_TOKEN_EXPIRY = '10m' } = process.env;
    const { _id, username } = this;

    return jwt.sign({ user_id: _id, username: username }, ACCESS_TOKEN_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  },
};

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

const User = model('User', UserSchema);

const findUserByUsername = async (username: string): Promise<UserType | null> => {
  return await User.findOne({ username: username });
};

export { User, UserType, findUserByUsername };
