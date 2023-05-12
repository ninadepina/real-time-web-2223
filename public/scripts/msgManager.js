import { timeData } from './time.js';

const messages = document.querySelector('.messages');

function htmlStr(obj) {
	const data = timeData();
	let result;

	switch (obj.type) {
		case 'chat_message':
			const allMessages = messages.querySelectorAll('li');
			const lastMsg = allMessages[allMessages.length - 1];
			result =
				allMessages.length === 0 || lastMsg.id !== obj.sender.username
					? `<div><h3>${obj.sender.username}</h3><h4>${data.h}:${data.m}</h4></div><p>${obj.message}</p>`
					: `<p>${obj.message}</p>`;
			break;
		case 'system_message_game':
			const msg = obj.message.split(' VS ');
			result = `<div><span><p>${msg[0]}</p><img src="/public/uploads/x2.svg" draggable="false"/></span><p> VS </p><span><img src="/public/uploads/o2.svg" draggable="false"/><p>${msg[1]}</p></span></div>`;
			break;
		case 'system_message_result':
			result =
				obj.message === 'DRAW'
					? `<div><h2>draw</h2></div>`
					: `<div><h2>winner: </h2><p>${obj.message}</p></div>`;
			break;
		case 'system_message_pussy':
			result = `<div><img src="/public/uploads/${obj.player}2.svg" draggable="false"/><p>${obj.message}</p></div>`;
			break;
		case 'private_message':
			result =
				obj.receiver === 'YOU'
					? `<div class="otherUser"><p>from</p><h3>${obj.sender}</h3><p>to</p><h3>YOU</h3><h4>${data.h}:${data.m}</h4></div><p>${obj.message}</p>`
					: obj.sender === 'YOU'
					? `<div class="currentUser"><p>from</p><h3>YOU</h3><p>to</p><h3>${obj.receiver}</h3><h4>${data.h}:${data.m}</h4></div><p>${obj.message}</p>`
					: '';
			break;
		default:
			result = `<p>${obj.message}</p>`;
			break;
	}
	return result;
}

export function onMessage(obj, currentUser) {
	const str = htmlStr(obj);
	const msg = document.createElement('li');

	switch (obj.type) {
		case 'system_message':
			msg.classList.add('server');
			break;
		case 'system_message_game':
			msg.classList.add('server_game');
			break;
		case 'system_message_result':
			msg.classList.add('server_game_result');
			break;
		case 'system_message_pussy':
			msg.classList.add('server_game_pussy');
			break;
		case 'private_message':
			msg.classList.add('private_message');
			break;
		case 'private_message_err':
			msg.classList.add('private_message_err');
			break;
		case 'chat_message':
			msg.id = obj.sender.username;

			const allMessages = messages.querySelectorAll('li');
			const lastMsg = allMessages[allMessages.length - 1];

			if (allMessages.length > 0 && lastMsg.id === obj.sender.username) msg.classList.add('double');
			msg.classList.add(obj.sender.username === currentUser ? 'currentUser' : 'otherUser');
			break;
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
