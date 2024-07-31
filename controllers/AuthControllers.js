import User from "../models/UserModel.js"

export const signup = async (req,res,next) => {
    try {
        console.log(req.body);
        const {email,password} = req.body
        console.log(email,password)
        const user = await User.create(req.body)
        res.send(200)
        
    } catch (error) {
        console.log({error})
        return res.status(500).send("Interna server error")
    }
}