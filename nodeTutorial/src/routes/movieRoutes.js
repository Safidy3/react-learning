import express from 'express'

const router = express.Router()

router.get("/", (req, res) => {
	res.json({ hello: 'world' });
})

router.post("/", (req, res) => {
	res.json({ hello: 'world' });
})

router.put("/", (req, res) => {
	res.json({ hello: 'world' });
})

router.delete("/", (req, res) => {
	res.json({ hello: 'world' });
})

export default router;
