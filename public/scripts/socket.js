const socket = io();

const form = document.querySelector('form');
const input = form.querySelector('input');
const messages = document.querySelector('ul');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	if (input.value) {
		socket.emit('message', input.value);
		input.value = '';
	}
});

socket.on('message', (msg) => {
	messages.appendChild(Object.assign(document.createElement('li'), { textContent: msg }));
	// messages.scrollTop = messages.scrollHeight;
});
