import { isTokenValid } from "../utils/jwt.js";

export const authenticatedUser = (req, res, next) => {
	try {	
		const token = req.cookies.token;
		if (!token) return res.status(401).send("you are not authorized")

		const { email, userId, profileSetup } = isTokenValid(token)

		req.user = { email, userId, profileSetup }
		next()
	} catch (error) {
		console.log(error)
	}
};
