import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('home');
});

router.post('/', (req, res) => {
	const postData = req.body;
	req.session.username = postData.username;

	res.redirect('/chat');
});

export default router;
