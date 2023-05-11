import { timeData } from './time.js';

const messages = document.querySelector('.messages');

function htmlStr(obj) {
	const data = timeData();
	if (obj.type == 'chat_message') {
		const allMessages = messages.querySelectorAll('li');
		const lastMsg = allMessages[allMessages.length - 1];
		if (allMessages.length == 0 || lastMsg.id != obj.sender.username) {
			return `<div><h3>${obj.sender.username}</h3><h4>${data.h}:${data.m}</h4></div><p>${obj.message}</p>`;
		}
		return `<p>${obj.message}</p>`;
	} else if (obj.type == 'system_message_game') {
		const msg = obj.message.split(' VS ');
		return `<div><span><p>${msg[0]}</p><img src="/public/uploads/x2.svg" draggable="false"/></span><p> VS </p><span><img src="/public/uploads/o2.svg" draggable="false"/><p>${msg[1]}</p></span></div>`;
	} else if (obj.type == 'system_message_result') {
		return `<div><h2>winner: </h2><p>${obj.message}</p></div>`;
	}
	return `<p>${obj.message}</p>`;
}

export function onMessage(obj, currentUser) {
	const str = htmlStr(obj);
	const msg = document.createElement('li');

	if (obj.type == 'system_message') {
		msg.classList.add('server');
	} else if (obj.type == 'system_message_game') {
		msg.classList.add('server_game');
	} else if (obj.type == 'system_message_result') {
		msg.classList.add('server_game_result');
	} else if (obj.type == 'chat_message') {
		msg.id = obj.sender.username;

		const allMessages = messages.querySelectorAll('li');
		const lastMsg = allMessages[allMessages.length - 1];

		if (allMessages.length > 0 && lastMsg.id == obj.sender.username) msg.classList.add('double');
		msg.classList.add(obj.sender.username === currentUser ? 'currentUser' : 'otherUser');
	}

	messages.appendChild(msg).innerHTML = str;
	messages.scrollTop = messages.scrollHeight;
}

export function onState(gifUrl) {
	const str = `<div><img src="${gifUrl}"></div>`;
	const msg = document.createElement('li');
	msg.classList.add('server_game_state');
	messages.appendChild(msg).innerHTML = str;
	messages.scrollTop = messages.scrollHeight;
}
