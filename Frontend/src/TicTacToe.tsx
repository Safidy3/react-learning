import { useState, type JSX } from 'react';

function Square({ value, onSquareClick }: { value: string | null, onSquareClick: () => void }): JSX.Element {
	return <button className="square" onClick={onSquareClick}>{value}</button>;
}

export default function Board() {
	const [squares, setSquares] = useState(Array(9).fill(null));

	function handleClick() {
		const nextSquares = squares.slice();
		nextSquares[0] = "X";
		setSquares(nextSquares);
	}

	return (
		<>
			<div className="board-row">
				<Square value={squares[0]} onSquareClick={handleClick} />
				<Square value={squares[1]} onSquareClick={handleClick} />
				<Square value={squares[2]} onSquareClick={handleClick} />
			</div>
		</>
	);
}
