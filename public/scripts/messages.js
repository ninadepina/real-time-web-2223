import { timeData } from './time.js';
import { createElement, appendChild } from './ui.js';

const messages = document.querySelector('.messages');

const onMessage = (obj, currentUser) => {
	const data = timeData();

	const li = createElement('li', {});
	const div = createElement('div', {});

	let sender = obj.sender;
	if (obj.sender === currentUser) sender = `You (@${obj.sender})`;
	const username = createElement('h3', { textContent: sender });
	const timestamp = createElement('h4', { textContent: `${data.h}:${data.m}` });

	appendChild(div, username);
	appendChild(div, timestamp);
	appendChild(li, div);

	const txt = createElement('p', { textContent: obj.message });
	appendChild(li, txt);

	obj.sender === currentUser ? li.classList.add('currentUser') : li.classList.add('otherUser');

	appendChild(messages, li);
	window.scrollTo(0, document.body.scrollHeight);
};

const onJoin = (new_user_msg) => {
	const li = createElement('li', { textContent: new_user_msg, classList: 'server' });
	appendChild(messages, li);
};

const onLeave = (left_user_msg) => {
	const li = createElement('li', { textContent: left_user_msg, classList: 'server' });
	appendChild(messages, li);
};

export { onMessage, onJoin, onLeave };
