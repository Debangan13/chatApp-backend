import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./db/connect.js"
import { v2 as cloudinary } from 'cloudinary';
dotenv.config()

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});


// importing routes 
import authRoute from './routes/AuthRoutes.js'
import contactRoute from './routes/ContactRoute.js'


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
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/contact", contactRoute);

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