import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { generateAccessToken, generateRefreshToken } from '../jwt';

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
  generateJwtRefreshToken?: () => string;
};

const UserSchema = new Schema({
  first_name: { type: String, required: true, min: 1, max: 255 },
  last_name: { type: String, required: true, min: 1, max: 255 },
  username: { type: String, required: true, unique: true, min: 1, max: 255 },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

UserSchema.methods = {
  generateJwtAccessToken: function (): string {
    const { _id, username } = this;
    return generateAccessToken(_id, username);
  },
  generateJwtRefreshToken: function (): string {
    const { _id, username } = this;
    return generateRefreshToken(_id, username);
  },
};

const User = model('User', UserSchema);

const findUserByUsername = async (username: string): Promise<UserType | null> => {
  return await User.findOne({ username: username });
};

export { User, UserType, findUserByUsername };
