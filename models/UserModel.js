import mongoose from "mongoose";
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
  lastName: {
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
  profileSetup: {
    type: Boolean,
    default:false ,
  },
});

UserSchema.pre("save", async function (next) {
  console.log(!this.isModified('password'))
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(password) {
  const isMatch = await bcrypt.compare(password,this.password)
  return isMatch
}


const User = mongoose.model("Users", UserSchema);

export default User;
