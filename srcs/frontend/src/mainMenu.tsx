import React, { useState, type JSX } from 'react';
import { Menu, User, Dice1, Hash, LogOut, TurkishLira } from 'lucide-react';
import NumberGame from "./kingOfDiamond/index"
import DiceGame from "./dice-game/index"

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"

const GAME_PAGES = {
	diceGame: 'diceGame',
	numberGame: 'numberGame'
};

const PAGES = {
	...GAME_PAGES,
	login: 'login',
	profile: 'profile',
	gameList: 'gameList',
	lobby: 'lobby'
};

type PageName = string;


type Page = keyof typeof PAGES;
type GameId = keyof typeof GAME_PAGES;

type Theme = 'default' | 'neon' | 'dark';

/*********** Props ************/

interface NavigationProps {
	currentPage: Page;
	navigate: (page: Page) => void;
	username: string;
	onLogout: () => void;
	theme: Theme;
	onThemeChange: (theme: Theme) => void;
}

interface AuthPageProps {
	onLogin: (username: string) => void;
}

interface ProfilePageProps {
	username: string;
}

/*********** data ************/

interface FormData {
	username: string;
	password: string;
}

interface Player {
	name: string;
	rank: number;
	id: string;
	isHost: boolean;
}

interface Game {
	id: GameId;
	name: string;
	description: string;
	icon: React.ReactNode;
}

/*********** PAGES ************/

// Navbar Component
function Navbar({ currentPage, navigate, username, onLogout, theme, onThemeChange }: NavigationProps): JSX.Element {
	return (
		<nav className="nav">
			<div className="nav-brand">
				<Menu size={24} />
				GameHub
			</div>
			<div className="nav-links">
				<div className="theme-switcher">
					<button
						className={`theme-btn ${theme === 'default' ? 'active' : ''}`}
						onClick={() => onThemeChange('default')}
					>
						Default
					</button>
					<button
						className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
						onClick={() => onThemeChange('dark')}
					>
						Dark
					</button>
				</div>
				<button
					className={`nav-link ${currentPage === 'gameList' ? 'active' : ''}`}
					onClick={() => navigate('gameList')}
				>
					Games
				</button>
				<button
					className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
					onClick={() => navigate('profile')}
				>
					<User size={18} />
					{username}
				</button>
				<button className="logout-btn" onClick={onLogout}>
					<LogOut size={18} /> Logout
				</button>
			</div>
		</nav>
	);
}

// Authentication Page
function AuthPage({ onLogin }: AuthPageProps): JSX.Element {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	const [formData, setFormData] = useState<FormData>({ username: '', password: '' });

	const handleSubmit = (): void => {
		if (formData.username)
			onLogin(formData.username);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === 'Enter')
			handleSubmit();
	};

	return (
		<div className="auth-container">
			<div className="auth-tabs">
				<button
					className={`tab-btn ${isLogin ? 'active' : ''}`}
					onClick={() => setIsLogin(true)}
				>
					Login
				</button>
				<button
					className={`tab-btn ${!isLogin ? 'active' : ''}`}
					onClick={() => setIsLogin(false)}
				>
					Register
				</button>
			</div>

			<div>
				<div className="form-group">
					<label>{isLogin ? 'Username or Email' : 'Username'}</label>
					<input
						type="text"
						placeholder="Enter username"
						value={formData.username}
						onChange={(e) => setFormData({ ...formData, username: e.target.value })}
						onKeyPress={handleKeyPress}
					/>
				</div>

				{!isLogin && (
					<div className="form-group">
						<label>Email</label>
						<input type="email" placeholder="Enter email" onKeyPress={handleKeyPress} />
					</div>
				)}

				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						placeholder="Enter password"
						value={formData.password}
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						onKeyPress={handleKeyPress}
					/>
				</div>

				<button onClick={handleSubmit} className="btn-primary">
					{isLogin ? 'Login' : 'Register'}
				</button>
			</div>
		</div>
	);
}

// Profile Page
function ProfilePage({ username }: ProfilePageProps): JSX.Element {
	return (
		<div className="profile-container">
			<div className="profile-header">
				<div className="avatar">
					{username.charAt(0).toUpperCase()}
				</div>
				<div className="profile-info">
					<h2>{username}</h2>
					<p style={{ color: '#666' }}>Player since 2024</p>
				</div>
			</div>

			<div className="profile-stats">
				<div className="stat-card">
					<h3>12</h3>
					<p>Games Played</p>
				</div>
				<div className="stat-card">
					<h3>8</h3>
					<p>Wins</p>
				</div>
				<div className="stat-card">
					<h3>4</h3>
					<p>Losses</p>
				</div>
			</div>

			<button className="btn-secondary">Edit Profile</button>
		</div>
	);
}

type LobbyPageProps = {
	gameId: string;
	startGame: (GameId: string) => void;
};

// Create room Page
function LobbyPage({ gameId }: LobbyPageProps) {
	const players: Player[] = [
		{
			name: 'Player 1',
			rank: 5,
			id: '#gd74ds5',
			isHost: true
		},
		{
			name: 'Player 2',
			rank: 2,
			id: '#gd74ds4',
			isHost: false
		}
	]

	return (
		<div>
			<div className="card">
				<h1>Room</h1>
				<div>
					<span id="code">A7F9K</span>
					<button >Copy</button>
				</div>
				<h2>Players</h2>
				<table className="table table-striped">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">name</th>
							<th scope="col">rank</th>
							<th scope="col">ID</th>
						</tr>
					</thead>
					<tbody>
						{players.map((player: Player) => (
							<tr>
								<th scope="row">1</th>
								<td>{player.name}</td>
								<td>{player.rank}</td>
								<td>{player.id}</td>
							</tr>
						))}
					</tbody>
				</table>
				<button className="btn btn-primary" onClick={() => startGame({ gameId })}>
					Start Game
				</button>
			</div>
		</div >
	)
}

// Game List
interface GameListProps {
	onStartGame: (gameId: GameId) => void;
}

function GameList({ onStartGame }: GameListProps): JSX.Element {

	const games: Game[] = [
		{
			id: 'diceGame',
			name: 'Dice Game',
			description: 'Roll three dice and test your luck! Get the highest score possible.',
			icon: '🎲'
		},
		{
			id: 'numberGame',
			name: 'Number Selection',
			description: 'Pick a number between 1 and 100. Choose wisely!',
			icon: '#️⃣'
		}
	];

	const lobby = ((gameId: string) => ({
		return<LobbyPage>
	}))

	return (
		<div className="game-list">
			{games.map(game => (
				<div key={game.id} className="game-card">
					<div className="game-icon">{game.icon}</div>
					<h3>{game.name}</h3>
					<p>{game.description}</p>
					<div className="gamecard-btn-cont">
						<button className="btn-primary" onClick={() => navigate('lobby')}>
							Join room
						</button>
						<button className="btn-primary" onClick={() => navigate('lobby')}>
							Create room
						</button>
					</div>
				</div>
			))}
		</div>
	);
}


// Main App Component with Routing
export default function App(): JSX.Element {

	const [currentPage, setCurrentPage] = useState<Page>('login');
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [username, setUsername] = useState<string>('');
	const [currentGame, setCurrentGame] = useState<GameId | null>(null);
	const [theme, setTheme] = useState<Theme>('dark');

	React.useEffect(() => {
		if (theme === 'neon')
			document.documentElement.setAttribute('data-theme', 'neon');
		else if (theme === 'dark')
			document.documentElement.setAttribute('data-theme', 'dark');
		else
			document.documentElement.removeAttribute('data-theme');
	}, [theme]);

	const navigate = (page: Page): void => {
		setCurrentPage(page);
	};

	const handleLogin = (user: string): void => {
		setUsername(user);
		setIsLoggedIn(true);
		navigate('gameList');
	};

	const handleLogout = (): void => {
		setIsLoggedIn(false);
		setUsername('');
		navigate('login');
	};

	const startGame = (game: GameId): void => {
		setCurrentGame(game);
		navigate(game);
	};


	return (
		<div className="app">
			{isLoggedIn && (
				<Navbar
					currentPage={currentPage}
					navigate={navigate}
					username={username}
					onLogout={handleLogout}
					theme={theme}
					onThemeChange={setTheme}
				/>
			)}

			<main className="main-content">
				{currentPage === 'login' && <AuthPage onLogin={handleLogin} />}
				{currentPage === 'profile' && <ProfilePage username={username} />}
				{currentPage === 'gameList' && <GameList onStartGame={startGame} />}

				{/* {currentPage === 'diceGame' && <DiceGame onBack={() => navigate('gameList')} />}
				{currentPage === 'numberGame' && <NumberGame onBack={() => navigate('gameList')} />} */}

			</main>
		</div>
	);
}

/*
design a the flow of the platteforme. here what we have now :
- 1rst view login/register screen
- 2nd, main view that has :
		-navigation bar that has :
			- a dropdown that does nothing
			- the plateform logo
			- 2 btn default and dark fo the theme (not very usual but il change it later)
			- 1 game buttion that redirect to the game list
			- a profile button that shows profile
			-a logout button
		- game list ( the default main page after login ):
		for each game card in the game list, there is a button join room and create room
		- 2 game page.

		thats all the pages i have for now (we are talking about frontend here, no backend yet).
		what should i add/remove. make a to do list in md.
*/


