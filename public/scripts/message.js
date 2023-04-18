import timeData from './time.js';
import { createElement, appendChild } from './ui.js';

const messages = document.querySelector('.messages');

export function onMessage(obj, currentUser) {
	const data = timeData();

	const li = createElement('li', {});
	const div = createElement('div', {});

	if (obj.sender === currentUser) obj.sender = 'You';
	const username = createElement('h3', { textContent: `${obj.sender}` });
	const timestamp = createElement('h4', { textContent: `${data.h}.${data.m}` });

	appendChild(div, username);
	appendChild(div, timestamp);
	appendChild(li, div);

	const txt = createElement('p', { textContent: obj.message });
	appendChild(li, txt);

	obj.sender === 'You' ? li.classList.add('currentUser') : li.classList.add('otherUser');

	appendChild(messages, li);
	window.scrollTo(0, document.body.scrollHeight);
}
