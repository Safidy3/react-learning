import { useState } from 'react';

function Message() {
	return <h1>hello world</h1>;
}

function MyButton() {
	return <button>I'm a button</button>;
}

function ListRendering() {
	const products = [
		{ title: 'Cabbage', isFruit: false, id: 1 },
		{ title: 'Garlic', isFruit: false, id: 2 },
		{ title: 'Apple', isFruit: true, id: 3 },
	];

	const listItems = products.map(product =>
		<li
			key={product.id}
			style={{
				color: product.isFruit ? 'magenta' : 'darkgreen'
			}}
		>
			{product.title}
		</li>
	);

	return (<ul>{listItems}</ul>);
}

function Event() {
	const [count, setCount] = useState(0);

	function handleClick() {
		setCount(count + 1);
	}

	return (
		<button onClick={handleClick}>
			Clicked {count} times
		</button>
	);
}

export default function Tutorial() {
	return (
		<>
			<Message />
			<MyButton />
			<ListRendering />
			<Event />
			<Event />
		</>
	);
}