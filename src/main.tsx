import "./App.css"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Tutorial from "./tutorial";
import TicTacToe from "./TicTacToe";
import GamePlateform from "./frontEnd";

function App() {
	return (
		<>
			<GamePlateform />
		</>
	);
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
