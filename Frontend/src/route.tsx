import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate, Outlet } from 'react-router-dom';

function Home() {
	const navigate = useNavigate();

	return (
		<div>
			<h1>Home</h1>
			<button onClick={() => navigate('/about')}>Go to About</button>
			<button onClick={() => navigate('/contact')}>Go to Contact</button>
			<hr />
			<Outlet />
		</div>
	);
}

function About() {
	const navigate = useNavigate();

	return (
		<div>
			<h1>About</h1>
			<button onClick={() => navigate('/home')}>Go to Home</button>
			<button onClick={() => navigate('/contact')}>Go to Contact</button>
		</div>
	);
}

function Contact() {
	const navigate = useNavigate();

	return (
		<div>
			<h1>Contact</h1>
			<button onClick={() => navigate('/home')}>Go to Home</button>
			<button onClick={() => navigate('/about')}>Go to About</button>
		</div>
	);
}

/*****************************/

function GameListWrapper() {
	const navigate = useNavigate();

	function handleGameSelect(gameId: string) {
		navigate(`/home/${gameId}`);
	}
	// return (<GameListWrapper handleGameSelect={handleGameSelect} />);
}

function GameList() {
	const navigate = useNavigate();
	return (
		<div>
			<h1>Game List</h1>
			<ul>
				<li><button onClick={() => navigate('game1')}>Game 1</button></li>
				<li><button onClick={() => navigate('game2')}>Game 2</button></li>
				<li><button onClick={() => navigate('game3')}>Game 3</button></li>
			</ul>
		</div>
	);
}

function Game1() {
	return <h2>Game 1</h2>;
}

function Game2() {
	return <h2>Game 2</h2>;
}

function Game3() {
	return <h2>Game 3</h2>;
}

/******************************/

function Nav() {
	return (
		<nav>
			<ul>
				<li><NavLink to="/home">Home</NavLink></li>
				<li><NavLink to="/about">About</NavLink></li>
				<li><NavLink to="/contact">Contact</NavLink></li>
			</ul>
		</nav>
	);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Nav />
			{children}
		</div>
	);
}

/******************************/

export default function RoutesComponent() {
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path="/" element={<Navigate to="/home" />} />

					<Route path="/home" element={<Home />}>
						<Route index element={<GameList />} />
						<Route path="game1" element={<Game1 />} />
						<Route path="game2" element={<Game2 />} />
						<Route path="game3" element={<Game3 />} />
					</Route>

					<Route path="/about" element={<About />} />
					<Route path="/contact" element={<Contact />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	)
}





