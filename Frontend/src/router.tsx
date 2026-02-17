import { createBrowserRouter } from "react-router-dom";
import { useLoaderData, Link, Outlet } from "react-router-dom";

interface user {
	id: number;
	name: string;
	email: string;
}

function NotFound() {
	return <h1>404 - Page Not Found</h1>;
}

function Nav() {
	return (
		<>
			<nav>
				<Link to="/">Home</Link> |{" "}
				<Link to="/users">Users</Link>
				<Link to="/about">About</Link>
			</nav>
		</>
	)
}

function About() {
	return (
		<div>
			<Nav />
			<h1>About Page</h1>
		</div>
	);
}


function AboutChild() {
	return (
		<div>
			<h1>About child</h1>
		</div>
	);
}

function Home() {
	return (
		<div>
			<h1>Home Page</h1>
			<p>Fetched Data: <b>HELLO WORLD</b></p>
		</div>
	);
}


function UserDetail() {
	const user = useLoaderData();

	return (
		<div>
			<h3>User Detail</h3>
			<p>Name: {user.name}</p>
			<p>Email: {user.email}</p>
			<p>Phone: {user.phone}</p>
		</div>
	);
}

function Users() {
	const users = useLoaderData();

	return (
		<div>
			<h2>Users List</h2>
			<ul>
				{users.map((user: user) => (
					<li key={user.id}>
						<Link to={user.id.toString()}>{user.name}</Link>
					</li>
				))}
			</ul>

			<hr />
			<Outlet />
		</div>
	);
}

function RootLayout() {
	return (
		<div>
			<h1>My App</h1>
			<Nav />
			<hr />
			<Outlet />
		</div>
	);
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: "users",
				element: <Users />,
				loader: async () => {
					const res = await fetch("https://jsonplaceholder.typicode.com/users");
					return res.json();
				},
				children: [
					{
						path: ":userId",
						element: <UserDetail />,
						loader: async ({ params }) => {
							const res = await fetch(
								`https://jsonplaceholder.typicode.com/users/${params.userId}`
							);
							return res.json();
						},
					},
				],
			},
			{
				path: "/about",
				element: <About />,
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);

export { router };