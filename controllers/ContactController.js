import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";

export const searchContacts = async (req, res) => {
	try {
		const {
			body: { searchTerm },
			user: { userId },
		} = req;

		if (searchTerm === undefined || searchTerm === null) {
			return res.status(400).send("searchTerm is requried");
		}

		const sanitizedSearchTerm = searchTerm.replace(
			/ [.*+?^${}()|[\]\\]/g,
			"\\$&"
		);

		const regex = new RegExp(sanitizedSearchTerm, "i");
		const contacts = await User.find({
			$and: [
				{ _id: { $ne: userId } },
				{
					$or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
				},
			],
		});

		// const searchParts = searchTerm.trim().split(/\s+/);

		// const regexArray = searchParts.map(
		// 	(part) => new RegExp(part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
		// );

		// const contacts = await User.find({
		// 	$and: [
		// 		{ _id: { $ne: userId } },
		// 		{
		// 			$or: regexArray.map((regex) => ({
		// 				$or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
		// 			})),
		// 		},
		// 	],
		// });

		return res.status(200).json({ contacts });
	} catch (error) {
		console.log(error.message);
	}
};

export const getContactsFromDmList = async (req, res) => {
	try {
		let { userId } = req.user;
		userId = new mongoose.Types.ObjectId(userId);
		const contacts = await Message.aggregate([
			{ $match: { $or: [{ sender: userId }, { recipient: userId }] } },
			{ $sort: { timestamp: -1 } },
			{
				$group: {
					_id: {
						$cond: {
							if: { $eq: ["$sender", userId] },
							then: "$recipient",
							else: "$sender",
						},
					},
					lastMessageTime: { $first: "$timestamp" },
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "contactInfo",
				},
			},
			/* by doing this i am getting an array of like this  
				email:['test3@gmail.com']
				firstName:['ram']
				image:[]
				lastMessageTime:"2024-08-31T08:35:18.724Z"
				lastName:['sham']*/
				
			// {
			// 	$project: {
			// 		_id: 1,
			// 		lastMessageTime: 1,
			// 		email: "$contactInfo.email",
			// 		firstName: "$contactInfo.firstName",
			// 		lastName: "$contactInfo.lastName",
			// 		image: "$contactInfo.image",
			// 		color: "$contactInfo.color",
			// 	},
			// },
			{
				$project: {
					_id: 1,
					lastMessageTime: 1,
					email: { $arrayElemAt: ["$contactInfo.email", 0] },
					firstName: { $arrayElemAt: ["$contactInfo.firstName", 0] },
					lastName: { $arrayElemAt: ["$contactInfo.lastName", 0] },
					image: { $arrayElemAt: ["$contactInfo.image", 0] },
					color: { $arrayElemAt: ["$contactInfo.color", 0] },
				},
			},
			{
				$sort: { lastMessageTime: -1 },
			},
		]);
		return res.status(200).json({ contacts });
	} catch (error) {
		console.log(error);
	}
};
