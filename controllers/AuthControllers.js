import { v2 as cloudinary } from "cloudinary";
import User from "../models/UserModel.js";
import { attachCookiesToResponse, createTokenUser } from "../utils/index.js";

// for user signup
export const signup = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email && !password) {
			return res.status(400).send("Email and Password required");
		}
		console.log(req.body)
		
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
		console.log("in login");
		const { email, password } = req.body;
		if (!email && !password) {
			return res.status(400).send("Email and Password required");
		}
		const user = await User.findOne({ email });
		console.log("user", user);
		if (!user) {
			return res.status(400).send("Email not found");
		}

		const isPasswordCorrect = await user.comparePassword(password);
		if (!isPasswordCorrect) {
			return res.send("Invalid Credentiales");
		}

		const tokenUser = createTokenUser(user);
		attachCookiesToResponse({ res, user: tokenUser });
		return res.status(200).json({ user });
	} catch (error) {
		console.log(error);
		return res.status(500).send("Interna server error");
	}
};

export const getUserInfo = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId);
		if (!user) {
			return res.status(404).send("User with given id not found");
		}
		return res.status(200).json({
			id: user._id,
			email: user.email,
			profileSetup: user.profileSetup,
			image: user.image,
			color: user.color,
			firstName: user.firstName,
			lastName: user.lastName,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
};

export const updateProfile = async (req, res) => {
	const {
		body: { firstName, lastName, color },
		user: { userId },
	} = req;

	if (!firstName || !lastName || !firstName) {
		return res.status(400).send("firstname lastname and color is required");
	}

	const user = await User.findByIdAndUpdate(
		userId,
		{
			firstName,
			lastName,
			color,
			profileSetup: true,
		},
		{ new: true, runValidators: true }
	);

	res.status(200).json({
		user: {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			color: user.color,
			profileSetup: user.profileSetup,
			image: user.image,
			email: user.email,
		},
	});
};

export const addProfileImage = async (req, res) => {
	const {
		body: { image },
		user: { userId },
	} = req;

	const user = await User.findByIdAndUpdate(
		userId,
		{ image: image },
		{ new: true, runValidators: true }
	);

	res.status(200).json({
		user: {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			color: user.color,
			profileSetup: user.profileSetup,
			image: user.image,
			email: user.email,
		},
	});
};
export const removeProfileImage = async (req, res) => {
	try {
		const {
			body: { publicID },
			user: { userId },
		} = req;

		console.log({ publicID });
		const user = await User.findById(userId);
		if (!user) return res.status(404).send("User not found");

		await cloudinary.api
			.delete_resources_by_prefix(`${publicID}`)
			.then((result) => console.log(result));

		user.image = null;
		await user.save();

		res.status(200).send("Profile image removed successfully");
	} catch (error) {
		console.log(error.message);
	}
};

export const generateSignature = (req, res) => {
	try {
		const timestamp = Math.round(new Date().getTime() / 1000);

		const signature = cloudinary.v2.utils.api_sign_request(
			{
				timestamp: timestamp,
				upload_preset: "your_upload_preset", // replace with your Cloudinary upload preset
			},
			process.env.CLOUDINARY_API_SECRET
		);

		res.json({ signature, timestamp });
	} catch (error) {
		console.log(error.message);
	}
};

export const logout = (req, res) => {
	try {
		res
			.clearCookie("token", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			})
			.status(200)
			.send("Successfully logout");
	} catch (error) {
		console.log(error.message);
	}
};
