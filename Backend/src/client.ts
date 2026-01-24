import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000");

socket.on("connect", () => {
	console.log("Connected:", socket.id);
	socket.emit("ping");
});

socket.on("pong", () => {
	console.log("Pong received from server");
});

socket.on("disconnect", () => {
	console.log("Disconnected");
});
