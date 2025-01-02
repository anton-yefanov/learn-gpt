import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  email: string;
  name?: string;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> =
  mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);

export default User;
