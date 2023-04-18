import express from 'express';
const route = express.Router();

let username;

route.get('/', (req, res) => {
	res.render('home');
});

route.post('/', (req, res) => {
	const postData = req.body;
	req.session.username = postData.username;

	res.redirect('/chat');
});

// set username
route.get('/username', (req, res) => {
	req.session.connected = req.session.loggedIn ?? false;

	const resultObj = {
		connected: req.session.connected,
		username: req.session.username
	};

	req.session.loggedIn = true;

	res.send(resultObj);
});

// chat
route.get('/chat', (req, res) => {
	if (!req.session.username) {
		res.redirect('/');
		return;
	}
	res.render('chat', { js: ['chat'] });
});

route.post('/chat', (req, res) => {
	const username = req.body.username;
	req.session.username = username;
	res.redirect('/chat');
});

export { route, username };
