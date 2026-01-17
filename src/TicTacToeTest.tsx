import { useState, type JSX } from 'react';

interface SquareProps {
	value: string | null;
	onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
	return (
		<button className="square" onClick={onSquareClick}>
			{value}
		</button>
	);
}

interface BoardProps {
	xIsNext: boolean;
	squares: (string | null)[];
	onPlay: (squares: (string | null)[]) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
	let status: string;

	function handleClick(i: number) {
		if (calculateWinner(squares) || squares[i])
			return;
		const nextSquares = squares.slice();
		if (xIsNext)
			nextSquares[i] = 'X';
		else
			nextSquares[i] = 'O';

		onPlay(nextSquares);
	}

	const winner: string | null = calculateWinner(squares);
	status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

	return (
		<>
			<div className="status">{status}</div>
			<div className="board-row">
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
			</div>
			<div className="board-row">
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
			</div>
			<div className="board-row">
				<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
			</div>
		</>
	);
}

export default function TicTacToe() {
	const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext: boolean = currentMove % 2 === 0;
	const currentSquares: (string | null)[] = history[currentMove];

	function handlePlay(nextSquares: (string | null)[]) {
		const nextHistory: (string | null)[][] = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove: number) {
		setCurrentMove(nextMove);
	}

	const moves: JSX.Element[] = history.map((squares: (string | null)[], move: number) => {
		let description: string;
		description = move > 0 ? `Go to move #${move}` : 'Go to game start';
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		);
	});

	return (
		<div className="game">
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	);
}

function calculateWinner(squares: (string | null)[]) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
