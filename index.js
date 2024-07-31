import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./db/connect.js"

// importing routes 
import authRouter from './routes/AuthRoutes.js'

dotenv.config()

const app = express() 

app.use(express.json())


const port = process.env.PORT || 3001

app.use(cors({
	origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}));

app.use(cookieParser());
// routs

app.use("/api/v1/auth", authRouter);

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI )
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error.message);
	}
};

start();