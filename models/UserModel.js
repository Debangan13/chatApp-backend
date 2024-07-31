import { hash } from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is Required"],
  },
  firstName: {
    type: String,
    required: false,
  },
  LastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    required: false,
  },
  ProfileSetup: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.getSalt();
  this.password = await hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SCERET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
const User = mongoose.model("Users", UserSchema);

export default User;
