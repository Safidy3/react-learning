import bcrypt from 'bcryptjs'
import { prisma } from '../config/db.js'
import { generateToken } from '../utils/generateTocken.js'

// register
const register = async (req, res) => {
	const { name, email, password } = req.body;

	const userExist = await prisma.user.findUnique({
		where: { email: email },
	})

	if (userExist)
		res.status(400).json({ error: "user already exist with this email" })

	// hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPsswd = await bcrypt.hash(password, salt);

	// create user
	const user = await prisma.user.create({
		data: { name, email, password: hashedPsswd }
	});

	// generate JWT tocken
	const tocken = generateToken(user.id, res);

	res.status(200).json({
		status: "success",
		data: {
			id: user.id,
			name: user.name,
			email: user.email
		},
		tocken
	});
}

// login
const login = async (req, res) => {
	const { name, email, password } = req.body;

	const user = await prisma.user.findUnique({
		where: { email: email },
	})

	if (!user)
		res.status(401).json({ error: "invalid email or password" });

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid)
		res.status(401).json({ error: "invalid email or password" });

	// generate JWT tocken
	const tocken = generateToken(user.id, res);

	res.status(200).json({
		status: "success",
		data: {
			id: user.id,
			name: user.name,
			email: user.email
		},
		tocken
	});
}

const logout = async (req, res) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0)
	})
	res.status(200).json({
		status: "success",
		message: "Logged out successfully"
	})
}

export { register, login, logout }

