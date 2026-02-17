import { prisma } from "../config/db.js"

const addToWatchlist = async (req, res) => {
	const { movieID, status, rating, note } = req.body;


	const movie = await prisma.movie.findUnique({
		where: { id: movieID }
	})

	if (!movie)
		return res.status(400).json({ error: "movie not found" });

	const existingInWatchList = await prisma.watchlistItem.findUnique({
		where: {
			userID_movieID: {
				userID: req.user.id,
				movieID: movieID
			}
		}
	})
	if (existingInWatchList)
		return res.status(400).json({ error: "movie already in watch list" });

	const watchListItem = await prisma.watchlistItem.create({
		data: {
			userID: req.user.id,
			movieID,
			status: status || "PLANNED",
			rating: rating || 1,
			note: note || "",
		}
	})

	res.status(201).json({
		status: "success",
		data: { watchListItem }
	})
}

export { addToWatchlist }