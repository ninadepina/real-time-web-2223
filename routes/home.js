import express from 'express';
import RoomController from '../controllers/RoomController.js';
const router = express.Router();

let username;
const roomController = new RoomController();

const uniqid = (prefix = '', random = false) => {
	const timestamp = Date.now().toString(36);
	const randomPart = random ? `.${Math.random().toString(36).slice(2)}` : '';
	return `${prefix}${timestamp}${randomPart}`;
};

router.get('/', (req, res) => {
	let type = 'join-room';

	if (req.query && req.query.type) type = req.query.type;

	res.render('home', {
		bodyClass: 'landing',
		js: ['formManager'],
		toggleType: type
	});
});

router.post('/', (req, res) => {
	const postData = req.body;

	if (postData.toggle) {
		res.redirect('/?type=' + postData.toggle);
		return;
	}

	if (postData.form_type == 'create') {
		req.session.roomId = roomController.getRoomId();
	} else if (postData.form_type == 'join' && postData.roomId != '') {
		if (postData.username == '') {
			res.redirect('/?m=no_username');
			return;
		}

		const room = roomController.roomIdExist(postData.roomId);

		if (!room) {
			res.redirect('/?m=no_room');
			return;
		}

		req.session.roomId = postData.roomId;
	} else if (postData.username == '') {
		res.redirect('/?m=no_username');
		return;
	} else {
		res.redirect('/?m=error');
		return;
	}

	req.session.username = postData.username;

	if (!req.session.users) req.session.users = {};

	const sessionId = uniqid();

	req.session.users[sessionId] = {
		express_session_id: sessionId,
		connected: false,
		username: req.session.username,
		roomId: req.session.roomId,
		loggedIn: false
	};

	res.redirect(`/room?esi=${sessionId}`);
});

export default router;
