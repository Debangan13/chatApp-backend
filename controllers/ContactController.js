import User from "../models/UserModel.js";

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
