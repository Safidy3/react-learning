import "./App.css"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from "react-router-dom";
// import Tutorial from "./tutorial";
// import TicTacToe from "./TicTacToe";
// import GamePlateform from "./frontEnd";
import { router } from "./router"

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
