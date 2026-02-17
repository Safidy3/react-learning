import jwt from "jsonwebtoken"
import { prisma } from "../config/db.js";

// read tocken from request
export const authMiddlware = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
		token = req.headers.authorization.split(" ")[1];
	else if (req.cookies?.jwt)
		token = req.cookies.jwt;
	if (!token)
		return res.status(401).json({ error: "not authorized" });

	// verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRETE)
		const userExist = await prisma.user.findUnique({ where: { id: decoded.id } })
		if (!userExist)
			return res.status(401).json({ error: "User no longer exist" });
		req.user = userExist;
		next();
	}
	catch (err) {
		return res.status(401).json({ error: "Something went wrong" });
	}
}

/*
 a27a242a-7b97-4b1e-8854-335d7210b2d4
 a27a242a-7b97-4b1e-8854-335d7210b2d4
*/
