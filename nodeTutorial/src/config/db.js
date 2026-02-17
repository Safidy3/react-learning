import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
	log: process.env.NODE_ENV == "development" ? ["query", "error", "warn"] : ["error"],
});

const connectDB = async () => {
	try {
		await prisma.$connect();
		console.log("db connected");
	}
	catch (error) {
		console.error(`database connection erroor: ${error}`);
	}
}

const disconnectDB = async () => {
	await prisma.$disconnectDB();
}

export { prisma, connectDB, disconnectDB };