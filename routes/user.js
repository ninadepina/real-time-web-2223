import express from 'express';
const router = express.Router();

router.get('/:esi', (req, res) => {
	const esi = req.params.esi;
	const selectedUser = req.session.users[esi];

	req.session.users[esi].connected = req.session.users[esi].loggedIn ? true : false;
	req.session.users[esi].loggedIn = true;

	res.send(selectedUser);
});

export default router;
