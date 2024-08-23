import User from "../models/UserModel.js";

export const searchContacts = async (req, res) => {
	try {
		const { searchTerm } = req.body;
        console.log(searchTerm);
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
				{ _id: { $ne: req.userId } },
				{
					$or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
				},
			],
		});
        return res.status(200).json({contacts})
	} catch (error) {
		console.log(error.message);
	}
};
