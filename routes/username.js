import express from 'express';
const router = express.Router();

let username;

router.get('/', (req, res) => {
	req.session.connected = req.session.loggedIn ?? false;

	const resultObj = {
		connected: req.session.connected,
		username: req.session.username
	};

	req.session.loggedIn = true;

	res.send(resultObj);
});

export default router;
export { username };
