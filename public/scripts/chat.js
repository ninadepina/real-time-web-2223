import socket from './socket.js';
import { onMessage } from './message.js';

const messages = document.querySelector('.messages');
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
	messages.appendChild(
		Object.assign(document.createElement('li'), { textContent: new_user_msg, classList: 'server' })
	);
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
	messages.appendChild(
		Object.assign(document.createElement('li'), { textContent: left_user_msg, classList: 'server' })
	);
});

export { currentUser };
