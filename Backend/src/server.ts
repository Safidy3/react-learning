import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket: Socket) => {
	console.log("Client connected:", socket.id);

	socket.on("ping", () => {
		socket.emit("pong");
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected:", socket.id);
	});
});

httpServer.listen(3000, () => {
	console.log("Server running on port 3000");
});
