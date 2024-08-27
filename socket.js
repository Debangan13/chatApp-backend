// import { Server } from "socket.io";

// const setupSocket = (server) => {
// 	const io = new Server(server, {
// 		cors: {
// 			origin: [process.env.ORIGIN],
// 			methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
// 			credentials: true,
// 		},
// 	});

//     const disconnect = (socket) => {
//         console.log(`Client Disconnected: ${socket.id}`)
//         for(const[userId,socketId] of userSocketMap.entries()){
//             if(socketId === socket.id){
//                 userSocketMap.delete(userId)
//                 break
//             }
//         }
//     }

// 	const userSocketMap = new Map();

// 	// io.on('connection',(socket)=> {
//     //     const userId = socket.handshake.query.userId
//     //     if (userId) {
//     //         userSocketMap.set(userId,socket.id)
//     //         console.log(`User connected: ${userId} with socket ID: ${socket.id}`)
//     //     } else {
//     //         console.log('User ID not provided during connection')
//     //     }
//     //     socket.on('disconnect', ()=> disconnect(socket))
//     // });

//     io.on('connection', (socket) => {
//         socket.on('chat message', (msg) => {
//           console.log('message: ' + msg);
//         });
//       });
// };
// export default setupSocket;

import { Server } from "socket.io";
import Message from "./models/MessageModel.js";

const userSocketMap = new Map();

const setupSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: [process.env.ORIGIN],
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		// Mapping userId to socket.id
		const userId = socket.handshake.query.userId;
		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
		} else {
			console.log("User ID not provided during connection");
		}

		// Handle disconnection
		const disconnect = (socket) => {
			console.log(`Client Disconnected: ${socket.id}`);

			for (const [userId, socketId] of userSocketMap.entries()) {
				if (socketId === socket.id) {
					userSocketMap.delete(userId);
					break;
				}
			}
		};
		socket.on("disconnect", () => disconnect(socket));

		// Handle Messages

		const sendMessage = async (message) => {
			try {
                const senderSocketId = userSocketMap.get(message.sender);
                const recipientSocketId = userSocketMap.get(message.recipient);
                console.log(message);
    
                const createdMessage = await Message.create(message);
    
                const messageDate = await Message.findById(createdMessage._id)
                    .populate("sender", "id email firstName lastName image color")
                    .populate("recipient", "id email firstName lastName image color");
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit("recieveMessage", messageDate);
                }
                if (senderSocketId) {
                    io.to(senderSocketId).emit("recieveMessage", messageDate);
                }
			} catch (error) {
                console.log(error.message)
            }
		};
		socket.on("sendMessage", sendMessage);
	});
};

export default setupSocket;
