import React, { useState, type JSX } from 'react';

interface GameProps {
	onBack: () => void;
}



function StatusScreen() {
	const Players = [
		{
			id: 'diceGame',
			img: 'default.png',
			point: '8',
			value: '15',
			winner: Math.random() > 0.5
		},
		{
			id: 'numberGame',
			img: 'default.png',
			point: '5',
			value: '34',
			winner: Math.random() > 0.5
		}
	];

	let totalPoints = Players.map(player => player.point).reduce((a, b) => Number(a) + Number(b), 0);
	let average = totalPoints / Players.length;
	let target = average * 0.8;

	return (
		<div className="result-card">
			<div className="player-list">
				{Players.map(player => (
					<div key={player.id} className={`${player.winner ? 'player-card-winner' : 'player-card-loser'}`}>
						<div className="player-point">pt : {player.point}</div>
						<div>{`${player.winner ? '👑' : ''}`}</div>
						<img
							className="player-avatar"
							src={new URL(`./images/${player.img}`, import.meta.url).href}
							alt={player.img}
						/>
						<div className="player-value">{player.value}</div>
					</div>
				))}
			</div>
			<div className="status-summary">
				<p>total points		: {totalPoints}</p>
				<p>average points	: {average}</p>
				<p>target points	: {average} x 0.8  = {target}</p>
			</div>
		</div>
	);
}

function WinnerScreen() {
	const Players = [
		{
			id: 'diceGame',
			img: 'default.png',
			point: '8',
			value: '15',
			winner: true
		}
	];

	return (
		<div>
			<div className="player-list">
				{Players.map(player => (
					<div key={player.id} className={`${player.winner ? 'player-card-winner' : 'player-card-loser'}`}>
						<div className="player-point">pt : {player.point}</div>
						<div>{`${player.winner ? '👑' : ''}`}</div>
						<img
							className="player-avatar"
							src={new URL(`./images/${player.img}`, import.meta.url).href}
							alt={player.img}
						/>
						<div className="player-value">{player.value}</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Number Selection Game
export default function NumberGame({ onBack }: GameProps): JSX.Element {
	const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
	const [submitted, setSubmitted] = useState<boolean>(false);

	const handleSubmit = (): void => {
		if (selectedNumber !== null) {
			setSubmitted(true);
		}
	};

	const handlePlayAgain = (): void => {
		setSubmitted(false);
		setSelectedNumber(null);
	};

	const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

	return (
		<div className="game-container">
			<div className="game-header">
				<h2>Number Selection Game</h2>
				<button className="back-btn" onClick={onBack}>Back</button>
			</div>

			{!submitted ? (
				<>
					<div className="number-input-container">
						<label>Select a number between 1 and 100:</label>
						<div className="number-grid">
							{numbers.map((num) => (
								<button
									key={num}
									className={`number-btn ${selectedNumber === num ? 'selected' : ''}`}
									onClick={() => setSelectedNumber(num)}
								>
									{num}
								</button>
							))}
						</div>
					</div>

					{selectedNumber !== null && (
						<div className="number-display">
							{selectedNumber}
						</div>
					)}

					<button
						className="btn-primary"
						onClick={handleSubmit}
						disabled={selectedNumber === null}
					>
						Submit Number
					</button>
				</>
			) : (
				<div className="game-over-container">
					<h2>Number Submitted!</h2>
					<p>You selected: <strong>{selectedNumber}</strong></p>
					<div className="button-group">
						<button className="btn-primary" onClick={handlePlayAgain}>
							Play Again
						</button>
						<button className="back-btn" onClick={onBack}>
							Back to Games
						</button>
					</div>
				</div>
			)}
		</div>
	);
}