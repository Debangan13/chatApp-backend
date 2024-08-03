import User from "../models/UserModel.js";
import {
  attachCookiesToResponse,
  createJWT,
  createTokenUser,
} from "../utils/index.js";

// for user signup
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).send("Email and Password required");
    }
    const user = await User.create({ ...req.body });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.ProfileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Interna server error");
  }
};

// for user login
export const login = async (req, res) => {
  try {
    console.log('in login')
    const { email, password } = req.body;
    console.log(email,password);
    if (!email && !password) {

      return res.status(400).send("Email and Password required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Email not found");
    }

    const isPasswordCorrect = await user.comparePassword(password)
    console.log(isPasswordCorrect) 
    console.log("hello ");

  } catch (error) {}
};
