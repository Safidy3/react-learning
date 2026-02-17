import express from 'express'
import { addToWatchlist } from '../controllers/watchListController.js'
import { authMiddlware } from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(authMiddlware)

// Register
router.post("/", addToWatchlist)

export default router;
