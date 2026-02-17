import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
	const payload = { id: userId };
	const token = jwt.sign(payload, process.env.JWT_SECRETE, {
		expiresIn: process.env.JWT_EXPIERS_IN || "7d"
	})

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 1000 * 60 * 60 * 24 * 7
	});
	return token
}

export { generateToken }
