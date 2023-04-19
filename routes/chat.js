import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	if (!req.session.username) {
		res.redirect('/');
		return;
	}
	res.render('chat', { js: ['chat'] });
});

router.post('/', (req, res) => {
	const username = req.body.username;
	req.session.username = username;
	res.redirect('/chat');
});

export default router;
