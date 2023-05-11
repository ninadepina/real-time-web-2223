import RoomController from './controllers/RoomController.js';
const roomController = new RoomController();
const rooms = {};

export default (io, socket) => {
	roomController.setConnectionState(true);

	const username = socket.username;
	const roomId = socket.roomId;

	let broadcastLeaveMsg = true;

	if (!rooms.hasOwnProperty(roomId)) {
		rooms[roomId] = {
			users: {},
			selectedUsers: [],
			currentPlayer: null,
			currentPlayerSocketId: null,
			gameData: {
				x: null,
				o: null,
				cells: ['', '', '', '', '', '', '', '', ''],
				winner: null
			}
		};
	}

	const users = rooms[roomId].users;

	socket.on('JOIN_ROOM', (wasConnectedBefore) => {
		socket.join(`${roomId}`);

		const room = io.sockets.adapter.rooms.get(roomId);
		if (room.size >= 2) {
			setTimeout(() => {
				io.to(`${roomId}`).emit('SHOW_BUTTON_GAME');
			}, 1000);
		}

		if (wasConnectedBefore) {
		} else {
			users[username] = {
				username: username,
				socketId: socket.id
			};
		}

		socket.emit('LOADER');

		console.log(`${username} has joined the ${roomId} room!`);

		socket.broadcast.to(`${roomId}`).emit('MESSAGE_IN_CHAT', {
			type: 'system_message',
			message: `${username} joined the room`
		});

		if (rooms[roomId].selectedUsers.length > 0) {
			let player;
			rooms[roomId].currentPlayer === rooms[roomId].gameData.x ? (player = 'x') : (player = 'o');
			io.to(users[username].socketId).emit('SHOW_STARTED_GAME', {
				x: rooms[roomId].selectedUsers[0].username,
				o: rooms[roomId].selectedUsers[1].username,
				currentPlayer: player,
				cells: rooms[roomId].gameData.cells
			});
			if (rooms[roomId].gameData.winner) io.to(users[username].socketId).emit('GAME_OVER');
		}
	});

	socket.on('CHAT_MESSAGE', (obj) => {
		io.to(`${roomId}`).emit('MESSAGE_IN_CHAT', {
			type: 'chat_message',
			sender: {
				username: obj.sender
			},
			message: obj.message
		});
	});

	socket.on('RANDOM_PLAYERS_SELECTION', () => {
		const room = io.sockets.adapter.rooms.get(roomId);
		if (room.size >= 2) {
			const players = rooms[roomId].users;
			const usernames = Object.keys(players);

			for (let i = usernames.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[usernames[i], usernames[j]] = [usernames[j], usernames[i]];
			}

			const selectedUsernames = usernames.slice(0, 2);
			rooms[roomId].selectedUsers = selectedUsernames.map((username) => players[username]);
			const startMsg = rooms[roomId].selectedUsers.map((user) => user.username).join(' VS ');

			io.to(`${roomId}`).emit('MESSAGE_IN_CHAT', {
				type: 'system_message_game',
				message: `${startMsg}`
			});

			io.to(`${roomId}`).emit('SHOW_GAME');

			rooms[roomId].gameData.x = rooms[roomId].selectedUsers[0].username;
			rooms[roomId].gameData.o = rooms[roomId].selectedUsers[1].username;

			rooms[roomId].currentPlayer = rooms[roomId].selectedUsers[0].username;
			rooms[roomId].currentPlayerSocketId = rooms[roomId].selectedUsers[0].socketId;

			io.to(rooms[roomId].currentPlayerSocketId).emit('SHOW_GAME_PLAYER');

			io.to(`${roomId}`).emit('SELECTED_USERS', {
				x: rooms[roomId].selectedUsers[0].username,
				o: rooms[roomId].selectedUsers[1].username
			});
		} else {
			console.log('Not enough players to start the game');
		}
	});

	socket.on('CELL_CLICK', (clickedCellIndex) => {
		const roomId = socket.roomId;
		const room = rooms[roomId];

		if (
			!room ||
			!room.gameData ||
			!room.gameData.cells ||
			room.gameData.winner ||
			room.currentPlayerSocketId !== socket.id
		) {
			return;
		}

		if (
			clickedCellIndex < 0 ||
			clickedCellIndex >= room.gameData.cells.length ||
			room.gameData.cells[clickedCellIndex] !== ''
		) {
			return;
		}

		let player;
		room.currentPlayer === room.gameData.x ? (player = 'x') : (player = 'o');
		room.gameData.cells[clickedCellIndex] = player;

		io.to(roomId).emit('CELL_CLICK', clickedCellIndex, player);

		const currentPlayerWon = checkWinningCondition(room.gameData.cells, room.currentPlayer);
		if (currentPlayerWon) {
			room.gameData.winner = room.currentPlayer;
			io.to(roomId).emit('GAME_OVER');
			io.to(room.currentPlayerSocketId).emit('GAME_OVER_WINNER', 'winner');

			let otherPlayer;
			room.currentPlayerSocketId = room.selectedUsers[0].socketId
				? (otherPlayer = room.selectedUsers[1].socketId)
				: (otherPlayer = room.selectedUsers[0].socketId);
			io.to(otherPlayer).emit('GAME_OVER_LOSER', 'loser');

			io.to(`${roomId}`).emit('MESSAGE_IN_CHAT', {
				type: 'system_message_result',
				message: `${room.gameData.winner}`
			});
		} else {
			switchPlayerTurn(room);
		}
	});

	function checkWinningCondition(cells, currentPlayer) {
		currentPlayer === rooms[roomId].gameData.x ? (currentPlayer = 'x') : (currentPlayer = 'o');

		const winningConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		];

		for (const condition of winningConditions) {
			const [a, b, c] = condition;
			if (cells[a] === currentPlayer && cells[b] === currentPlayer && cells[c] === currentPlayer) {
				return true;
			}
		}
		return false;
	}

	function switchPlayerTurn(room) {
		if (room.currentPlayer === room.selectedUsers[0].username) {
			room.currentPlayer = room.selectedUsers[1].username;
			room.currentPlayerSocketId = room.selectedUsers[1].socketId;
		} else {
			room.currentPlayer = room.selectedUsers[0].username;
			room.currentPlayerSocketId = room.selectedUsers[0].socketId;
		}
		io.to(room.currentPlayerSocketId).emit('SHOW_GAME_PLAYER');
	}

	socket.on('CLEAR_GAME', () => {
		const roomId = socket.roomId;
		const room = rooms[roomId];

		room.selectedUsers = [];
		room.currentPlayer = null;
		room.currentPlayerSocketId = null;
		room.gameData = {
			x: null,
			o: null,
			cells: ['', '', '', '', '', '', '', '', ''],
			winner: null
		};

		io.to(`${roomId}`).emit('GAME_CLEARED');
	});

	socket.on('disconnect', () => {
		console.log(`${username} disconnected from socket`);

		const room = io.sockets.adapter.rooms.get(roomId);
		if (room && room.size < 2) {
			io.to(`${roomId}`).emit('HIDE_BUTTON_GAME');
		}

		roomController.setConnectionState(false);

		setTimeout(() => {
			if (roomController.getConnectionState() && username) {
				console.log(`${username} has rejoined the room`);
				socket.broadcast.to(`${roomId}`).emit('MESSAGE_IN_CHAT', {
					type: 'system_message',
					message: `${username} rejoined the room`
				});
			} else {
				socket.leaveAll();

				if (broadcastLeaveMsg) {
					const usernamesInRoom = roomController.listRoomUsers(rooms[roomId].users);

					if (usernamesInRoom.length - 1 > 0) {
						socket.broadcast.to(`${roomId}`).emit('MESSAGE_IN_CHAT', {
							type: 'system_message',
							message: `${username} left the room`
						});
					}
				}
				delete rooms[roomId].users[username];

				const usernamesInRoom = roomController.listRoomUsers(rooms[roomId].users);

				if (usernamesInRoom.length === 0) {
					delete rooms[roomId];
					roomController.deleteRoomFromJson(roomId);
					console.log('deleted room');
				} else {
				}
			}
		}, 2000);
	});
};
