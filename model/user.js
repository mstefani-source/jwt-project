import { Schema, model } from "mongoose";
export const findOne = (email) => {return true};
export const create = () => {}

const userSchema = new Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

export default model("user", userSchema);