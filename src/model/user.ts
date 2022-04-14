import { Schema, model } from "mongoose";

/**
 * Type representing a user with fields to support type-safe data flow.
 */
type UserType = {
    _id?: string,
    firstName: string,
    lastName: string,
    username: string,
    password: string,
};

const UserSchema = new Schema({
    first_name: { type: String, required: true, min: 1, max: 255 },
    last_name: { type: String, required: true, min: 1, max: 255 },
    username: { type: String, required: true, unique: true, min: 1, max: 255 },
    password: { type: String, required: true },
});

const User = model('User', UserSchema);

export { User, UserType };