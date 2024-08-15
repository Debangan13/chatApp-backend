
import { isTokenValid } from "../utils/jwt.js";

export const authenticatedUser = (req, res, next) => {
	try {
	const token = req.cookies;
	if (!token) return res.status(401).send("you are not authorized");

		const data = isTokenValid(token);

		req.user = data;
		next();
	} catch (error) {
		console.log(error);
	}
};
