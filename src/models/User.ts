import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true, index: true },
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
