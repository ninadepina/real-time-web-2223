import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	if (!req.session.username || !req.session.roomId) {
		res.redirect('/');
		return;
	}
	console.log(req.session);
	res.render('room', {
		bodyClass: 'room',
		js: ['room', 'copyOnClick'],
		roomId: req.session.roomId,
	});
});

export default router;
