import socket from './socket.js';
import { onMessage, onState } from './msgManager.js';
import { fetchGIF } from './gif.js';

const form = document.querySelector('.chat_form');
const input = document.querySelector('.chat_input');
const button = document.querySelector('#tictactoe_start');

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

		console.log(result);

		socket.auth = { username: username, roomId: roomId };
		socket.connect();

		socket.emit('JOIN_ROOM', result.connected);
	});

socket.on('LOADER', (username) => {
	setTimeout(() => {
		const loaderEl = document.querySelector('.loading');
		const mainEl = document.querySelector('.main_room');
		loaderEl.classList.add('hide');
		mainEl.classList.remove('hide');
	}, 1000);
});

socket.on('MESSAGE_IN_CHAT', (msg) => {
	onMessage(msg, currentUser);
});

// socket.on('ERROR', (errorData) => {
// 	if (errorData.type == 'username_taken') {
// 		socket.disconnect(errorData.type);
// 		window.location.href = `/?m=${errorData.type}`;
// 	}
// });

form.addEventListener('submit', function (e) {
	e.preventDefault();

	if (input.value) {
		socket.emit('CHAT_MESSAGE', {
			message: input.value,
			sender: currentUser
		});
		input.value = '';
	}
});

const board = `<div id="tictactoe_info"><span><p id="x">player1</p><img src="/public/uploads/x2.svg" draggable="false" /></span><p>VS</p><span><img src="/public/uploads/o2.svg" draggable="false" /><p id="o">player2</p></span></div><div id="tictactoe_cont"><button data-cell-index="0" class="cell" disabled></button><button data-cell-index="1" class="cell" disabled></button><button data-cell-index="2" class="cell" disabled></button><button data-cell-index="3" class="cell" disabled></button><button data-cell-index="4" class="cell" disabled></button><button data-cell-index="5" class="cell" disabled></button><button data-cell-index="6" class="cell" disabled></button><button data-cell-index="7" class="cell" disabled></button><button data-cell-index="8" class="cell" disabled></button></div>`;

const container = document.querySelector('#tictactoe_bigcont');
const countdownEl = document.querySelector('#tictactoe_countdown');

socket.on('SHOW_BUTTON_GAME', () => {
	button.removeAttribute('disabled');
});
socket.on('HIDE_BUTTON_GAME', () => {
	button.setAttribute('disabled', '');
});

button.addEventListener('click', () => {
	socket.emit('RANDOM_PLAYERS_SELECTION');
});

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
		container.classList.add('x');
		containerItem1.style.display = 'grid';
		containerItem2.style.display = 'grid';
	}, 3000);
});
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

function startCountdown() {
	let count = 3;

	const countdownInterval = setInterval(() => {
		count--;
		countdownEl.textContent = count;

		if (count <= 0) clearInterval(countdownInterval);
	}, 1000);
}

socket.on('SHOW_GAME_PLAYER', () => {
	document.querySelectorAll('.cell').forEach((cell) => cell.removeAttribute('disabled'));
});

socket.on('SELECTED_USERS', (users) => {
	document.querySelector('#x').textContent = users.x;
	document.querySelector('#o').textContent = users.o;
});

function handleCellPlayed(clickedCell, clickedCellIndex, player) {
	clickedCell.innerHTML = `<img src="/public/uploads/${player}.svg" draggable="false" />`;
}

function handleCellClick(clickedCellEvent) {
	console.log('handleCellClick');
	const clickedCell = clickedCellEvent.target;
	const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

	socket.emit('CELL_CLICK', clickedCellIndex);
}

socket.on('CELL_CLICK', (clickedCellIndex, player) => {
	container.classList.add(player === 'x' ? 'o' : 'x');
	container.classList.remove(player === 'x' ? 'x' : 'o');

	const clickedCell = document.querySelector(`[data-cell-index="${clickedCellIndex}"]`);

	handleCellPlayed(clickedCell, clickedCellIndex, player);
});

socket.on('GAME_OVER', async () => {
	container.classList.remove('x');
	container.classList.remove('o');
});
socket.on('GAME_OVER_WINNER', async (obj) => {
	const gifUrl = await fetchGIF(obj);
	onState(gifUrl);
});
socket.on('GAME_OVER_LOSER', async (obj) => {
	const gifUrl = await fetchGIF(obj);
	onState(gifUrl);
});
