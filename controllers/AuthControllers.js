import User from "../models/UserModel.js"
import { attachCookiesToResponse, createJWT, createTokenUser } from "../utils/index.js";

export const signup = async (req,res,next) => {
    try {
        const {email,password} = req.body
        if(!email && !password) return
        const user = await User.create({...req.body})
        const tokenUser = createTokenUser(user)
        attachCookiesToResponse({res,user:tokenUser})

        return res.status(201).json({user:{
            id:user._id,
            email:user.email,
            profileSetup:user.ProfileSetup
        }});
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("Interna server error")
    }
}