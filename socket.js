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

const userSocketMap = new Map();

const setupSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: [process.env.ORIGIN],
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
			credentials: true,
		},
	});

	const disconnect = (socket) => {
		console.log(`Client Disconnected: ${socket.id}`);

		for (const [userId, socketId] of userSocketMap.entries()) {
			if (socketId === socket.id) {
				userSocketMap.delete(userId);
				break;
			}
		}
	};

	io.on('connection', (socket) => {
		// Mapping userId to socket.id
		const userId = socket.handshake.query.userId;
		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
		} else {
			console.log('User ID not provided during connection');
		}

		// Handle disconnection
		socket.on('disconnect', () => disconnect(socket));
	});
};

export default setupSocket;
