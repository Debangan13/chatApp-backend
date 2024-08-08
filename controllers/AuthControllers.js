import User from "../models/UserModel.js";
import {
  attachCookiesToResponse,
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
    const { email, password } = req.body;
    if (!email && !password) {

      return res.status(400).send("Email and Password required");
    }
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(400).send("Email not found");
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
      return res.status(401).send("Invalid Credentiales")
    }

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    return res.status(200).json({user})

  } catch (error) {
    console.log(error);
    return res.status(500).send("Interna server error");
  }
};

export const getUserInfo = (req,res) => {
  res.send("ok")
}