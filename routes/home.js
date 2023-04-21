import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('home');
});

router.post('/', (req, res) => {
	const data = req.body;
	req.session.username = data.username;
	// req.session.room = data.room;

	res.redirect('/room');
});

export default router;
