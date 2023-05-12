import socket from './socket.js';
import { onMessage, onState } from './msgManager.js';
import { fetchGIF } from './gif.js';

const form = document.querySelector('.chat_form');
const input = document.querySelector('.chat_input');
const typingMsg = document.querySelector('#typing');
const button = document.querySelector('#tictactoe_start');
const container = document.querySelector('#tictactoe_bigcont');
const countdownEl = document.querySelector('#tictactoe_countdown');

const board = `<div id="tictactoe_info"><span><p id="x">player1</p><img src="/public/uploads/x2.svg" draggable="false" /></span><p>VS</p><span><img src="/public/uploads/o2.svg" draggable="false" /><p id="o">player2</p></span></div><div id="tictactoe_cont"><button data-cell-index="0" class="cell" disabled></button><button data-cell-index="1" class="cell" disabled></button><button data-cell-index="2" class="cell" disabled></button><button data-cell-index="3" class="cell" disabled></button><button data-cell-index="4" class="cell" disabled></button><button data-cell-index="5" class="cell" disabled></button><button data-cell-index="6" class="cell" disabled></button><button data-cell-index="7" class="cell" disabled></button><button data-cell-index="8" class="cell" disabled></button></div><button id="tictactoe_clear">clear game</button>`;

let currentUser;
let currentRoom;

const urlParams = new URLSearchParams(window.location.search);
const ESI = urlParams.get('esi');

fetch(`/user/${ESI}`)
	.then((res) => res.json())
	.then((result) => {
		const username = result.username;
		const roomId = result.roomId;

		currentUser = username;
		currentRoom = roomId;

		// console.log(result);

		socket.auth = { username: username, roomId: roomId };
		socket.connect();

		socket.emit('JOIN_ROOM', result.connected);
	});

form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (input.value) {
		socket.emit('CHAT_MESSAGE', {
			message: input.value,
			sender: currentUser
		});
		input.value = '';
	}
});

input.addEventListener('keydown', (e) => {
	if (e.key !== 'Enter' && input.value.length > 0) {
		socket.emit('START_TYPING');
		setTimeout(() => {
			socket.emit('STOP_TYPING');
		}, 2000);
	} else {
		socket.emit('STOP_TYPING');
	}
});

button.addEventListener('click', () => {
	socket.emit('RANDOM_PLAYERS_SELECTION');
});

// loader (before entering room)
socket.on('LOADER', () => {
	setTimeout(() => {
		const loaderEl = document.querySelector('.loading');
		const mainEl = document.querySelector('.main_room');
		loaderEl.classList.add('hide');
		mainEl.classList.remove('hide');
	}, 1000);
});

// chat message
socket.on('MESSAGE_IN_CHAT', (msg) => {
	onMessage(msg, currentUser);
});

// error handling
socket.on('ERROR', (err) => {
	socket.disconnect(err.type);
	window.location.href = `/?m=${err.type}`;
});

// typing indication
socket.on('START_TYPING', (user) => {
	if (user === currentUser) return;
	typingMsg.textContent = `${user} is typing...`;
});

socket.on('STOP_TYPING', () => {
	typingMsg.textContent = '';
});

// update users in room
socket.on('USERS_IN_ROOM', (users) => {
	document.querySelector('.container_users span').innerHTML = Object.keys(users).length;

	const ul = document.querySelector('.user_dropdown ul');
	const usernames = ul.querySelectorAll('li');
	usernames.forEach((username) => username.remove());

	for (const key in users) {
		if (users.hasOwnProperty(key)) {
			const user = users[key];
			const li = document.createElement('li');
			li.innerText = user.username;
			ul.appendChild(li);
		}
	}
});

socket.on('USERS_IN_ROOM_DELETE', (users) => {
	document.querySelector('.container_users span').innerHTML = Object.keys(users.stay).length;

	const ul = document.querySelector('.user_dropdown ul');
	const usernames = ul.querySelectorAll('li');

	for (let i = 0; i < usernames.length; i++) {
		if (users.left === usernames[i].textContent) {
			usernames[i].remove();
			break;
		}
	}
});

// visibility of 'START GAME' button
socket.on('SHOW_BUTTON_GAME', () => {
	button.removeAttribute('disabled');
});

socket.on('HIDE_BUTTON_GAME', () => {
	button.setAttribute('disabled', '');
});

// start game
socket.on('SHOW_GAME', () => {
	button.style.display = 'none';

	container.insertAdjacentHTML('beforeend', board);
	const containerItem1 = document.querySelector('#tictactoe_info');
	const containerItem2 = document.querySelector('#tictactoe_cont');
	containerItem1.style.display = 'none';
	containerItem2.style.display = 'none';

	document.querySelectorAll('.cell').forEach((cell) => cell.addEventListener('click', handleCellClick));

	countdownEl.style.display = 'block';
	startCountdown();

	setTimeout(() => {
		countdownEl.style.display = 'none';
		countdownEl.textContent = 3;
		container.classList.add('x');
		containerItem1.style.display = 'grid';
		containerItem2.style.display = 'grid';
	}, 3000);
});

// show already started game
socket.on('SHOW_STARTED_GAME', (users) => {
	button.style.display = 'none';

	container.insertAdjacentHTML('beforeend', board);
	container.classList.add(`${users.currentPlayer}`);

	document.querySelector('#x').textContent = users.x;
	document.querySelector('#o').textContent = users.o;

	const data_cells = document.querySelectorAll('[data-cell-index]');
	users.cells.forEach((cell, index) => {
		const data_cell = data_cells[index];
		if (cell !== '') {
			data_cell.innerHTML = `<img src="/public/uploads/${cell}.svg" draggable="false" />`;
		}
	});
});

// switch between players
socket.on('SHOW_GAME_PLAYER', () => {
	document.querySelectorAll('.cell').forEach((cell) => cell.removeAttribute('disabled'));
	document.querySelector('#tictactoe_cont').classList.add('border');
});

socket.on('REMOVE_GAME_PLAYER', () => {
	document.querySelectorAll('.cell').forEach((cell) => cell.setAttribute('disabled', ''));
	document.querySelector('#tictactoe_cont').classList.remove('border');
});

// random players selection
socket.on('SELECTED_USERS', (users) => {
	document.querySelector('#x').textContent = users.x;
	document.querySelector('#o').textContent = users.o;
});

//playing game
socket.on('CELL_CLICK', (clickedCellIndex, player) => {
	container.classList.add(player === 'x' ? 'o' : 'x');
	container.classList.remove(player === 'x' ? 'x' : 'o');

	const clickedCell = document.querySelector(`[data-cell-index="${clickedCellIndex}"]`);

	handleCellPlayed(clickedCell, clickedCellIndex, player);
});

// finished game
socket.on('GAME_OVER', () => {
	document.querySelectorAll('.cell').forEach((cell) => cell.setAttribute('disabled', ''));

	document.querySelector('#tictactoe_cont').classList.remove('border');

	container.classList.remove('x');
	container.classList.remove('o');

	setTimeout(() => {
		const clearButton = document.querySelector('#tictactoe_clear');
		clearButton.style.visibility = 'visible';
		clearButton.addEventListener('click', () => {
			socket.emit('CLEAR_GAME');
		});
	}, 3000);
});

socket.on('GAME_OVER_WINNER', async (obj) => {
	const gifUrl = await fetchGIF(obj);
	onState(gifUrl);
});

socket.on('GAME_OVER_LOSER', async (obj) => {
	const gifUrl = await fetchGIF(obj);
	onState(gifUrl);
});

// clear game
socket.on('GAME_CLEARED', () => {
	document.querySelector('#tictactoe_info').remove();
	document.querySelector('#tictactoe_cont').remove();
	document.querySelector('#tictactoe_clear').remove();

	button.style.display = 'block';
});

// functions for game
function handleCellPlayed(clickedCell, clickedCellIndex, player) {
	clickedCell.innerHTML = `<img src="/public/uploads/${player}.svg" draggable="false" />`;
}

function handleCellClick(clickedCellEvent) {
	const clickedCell = clickedCellEvent.target;
	const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

	socket.emit('CELL_CLICK', clickedCellIndex);
}

function startCountdown() {
	let count = 3;

	const countdownInterval = setInterval(() => {
		count--;
		countdownEl.textContent = count;

		if (count <= 0) clearInterval(countdownInterval);
	}, 1000);
}
