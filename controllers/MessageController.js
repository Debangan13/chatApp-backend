import Message from "../models/MessageModel.js";

export const getMessage = async (req, res) => {
	try {

		const user1 = req.user.userId;
		const user2 = req.body.id;

		if (!user1 || !user2) {
			return res.status(400).send("both user ID's are required.");
		}

		const messages = await Message.find({
			$or: [
				{ sender: user1, recipient: user2 },
				{ sender: user2, recipient: user1 },
			],
		}).sort({ timestamp: 1 });
		
		return res.status(200).json({ messages });
	} catch (error) {
		console.log(error.messages);
	}
};
