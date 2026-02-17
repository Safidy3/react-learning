import express from 'express';
import { config } from "dotenv"
import { connectDB, disconnectDB } from "./config/db.js"
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchListRoutes from './routes/watchListRoutes.js';

config();
connectDB();

const app = express();
const PORT = 5001;

// body parsing middlware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API routes
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/watchlist", watchListRoutes);

const server = app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});

// HANDLE UNEXPECTED DB PROMISE REJECTION
process.on("unhandledRejection", (err) => {
	console.err("Unhandle rejection", err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});

process.on("uncaughtException", (err) => {
	console.err("Uncaught exception", err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});

process.on("SIGTERM", () => {
	console.log("SIGTERM received, shutting down gracefully");
	server.close(async () => {
		await disconnectDB();
		process.exit(0);
	});
});






/**
 * 
 * AUTH - signin, signup
 * MOVIE - get all  movies
 * USER - Profile
 * WATCHLIST
 * 
 */


