import socket from './socket.js';
import { onMessage, onJoin, onLeave } from './messages.js';

const form = document.querySelector('.chat_form');
const input = document.querySelector('.chat_input');

let currentUser;

fetch('/username')
	.then((res) => res.json())
	.then((result) => {
		const username = result.username;
		currentUser = username;

		socket.auth = { username };
		socket.connect();

		socket.emit('new_user', username);
	});

socket.on('new_user', (new_user_msg) => {
	onJoin(new_user_msg);
});

form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (input.value) {
		socket.emit('message', {
			message: input.value,
			sender: currentUser
		});
		input.value = '';
	}
});

socket.on('message', (obj) => {
	onMessage(obj, currentUser);
});

socket.on('left_user', (left_user_msg) => {
	onLeave(left_user_msg);
});

export { currentUser };
