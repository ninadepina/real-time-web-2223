# 'TIC TAC TOE' - Documentation

During the [Real-Time Web](https://github.com/cmda-minor-web/real-time-web-2223) course, we were asked to build a real-time application.

**Goals of this course:**

-   _deal with real-time complexity;_
-   _handle real-time client-server interaction;_
-   _handle real-rime data management;_
-   _handle multi-user support._

---

## Week 1

I've never really worked with socket.io before. I did do a project containing socket.io but I was responsible for login/signing up (with passport.js). This project will be the first project implementing sockets from scratch. I'm excited to learn more about it.

I started with a basic setup of the server and client. A user can enter a username and then chat with other users.

```js
// server side
io.on('connection', (socket) => {
	console.log('user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('CHAT_MESSAGE', (msg) => {
		io.emit('chat message', msg);
	});
});
```

```js
// client side
const socket = io();

const messages = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (input.value) {
		socket.emit('CHAT_MESSAGE', input.value);
		input.value = '';
	}
});

socket.on('CHAT_MESSAGE', (msg) => {
	const li = document.createElement('li');
	li.textContent = msg;
	messages.appendChild(li);
});
```

I found this to be fairly easy (I clearly didn't know what was coming yet..).

---

## Week 2

I started this week by brainstorming about what I wanted to build. I eventually came up with the idea of a Tic Tac Toe game. I also wanted to implement rooms, and a chat feature in those rooms, so users could chat with each other while playing the game.

I found it quite difficult to implement rooms. I had to do a lot of research to get it working. It took the whole week, but I eventually got it working ;)!

### Concept

I would like my Real-Time application to have the following features:

-   Users must be able to choose their own username
-   Users must be able to create a room
-   Users must be able to join a room
-   Users must be able to chat with other users
-   Users must be able to play a game of Tic Tac Toe

    -   System must be able to only allow Tic Tac Toe to be played when there are min. two players in a room
    -   System must be able to randomly select two players from a room
    -   Users must be able to see the game board and the current player (even if they join the game later)
    -   Users (that play) must be able to place a marker on the game board, other users can't place a marker
    -   Users must be able to see who won the game
    -   Users must be able to restart the game

#### Design

![design landing page](https://github.com/ninadepina/tic-tac-toe/assets/89778503/33cf9b82-1179-47b0-bf8e-7a2d79e4a719)
![design room page](https://github.com/ninadepina/tic-tac-toe/assets/89778503/5e61beb8-61ff-434d-9196-0a7123e4cde8)

---

## Week 3

After having trouble with implementing the rooms, I didn't know if I could finish the rest of the project in one week. But when trying to implement other features, I started to understand socket.io more and more.

When creating the tictactoe game I encountered some problems. One of which was that when a user joined the room when there was already a game going on, the user would not be able to see the game. I fixed this by saving different variables in the server.

```js
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
```

I almost forgot we had to add in an api. I chose the GIPHY api to send a random winner or loser GIF to the players.

```js
export const fetchGIF = async (obj) => {
	let state;
	obj === 'winner' ? (state = 'winner') : (state = 'loser');

	const url = `http://api.giphy.com/v1/gifs/search?q=${state}&api_key=454o81odJoh3KwZ3JkOnWu33emb4oRy8&limit=50`;

	try {
		const data = await (await fetch(url)).json();
		const randomNumber = Math.floor(Math.random() * data.data.length);

		return data.data[randomNumber].images.original.url;
	} catch (err) {
		console.error(err);
	}
};
```

The final result can be found [here](https://tictactoe-ninadepina.up.railway.app/).

### Data life cycle

> A data life cycle refers to (a visual representation of) the different stages involved in the transfer of data over a network socket.

The life cycle of this application starts at the homescreen, where users have the option to either create a new room or join an existing one. This user data is exchanged between the client and server through a fetch to `/user/:esi`. When trying to join a room with a username that's already present in the room, the server will send back an error message.

Upon room join, a loader will be shown, then the room. The room will show the current players in the room, the chat and the start game button. When the room contains 2 or more users, the start button can be clicked and 2 players from the chat will randomly get selected. These 2 players will be able to play a game of Tic Tac Toe. The other users will be able to spectate the game. When the game is over, everyone will be able to clear the game and start a new one.

![datalifecycle](https://github.com/ninadepina/tic-tac-toe/assets/89778503/3070fd8a-8f73-409d-9a81-65ad77796724)

### Real-time events

| Event name             | Description                                                  | Emit   | Listen |
| ---------------------- | ------------------------------------------------------------ | ------ | ------ |
| `JOIN_ROOM`            | Sends user info to the server                                | Client | Server |
| `ERROR`                | Sends error message to the client                            | Server | Client |
| `LOADER`               | Shows loading screen                                         | Server | Client |
| `USERS_IN_ROOM`        | Sends info of all users in room to the client                | Server | Client |
| `SHOW_BUTTON_GAME`     | If room.size >= 2, shows start game button                   | Server | Client |
| `HIDE_BUTTON_GAME`     | If room.size < 2, hides start game button                    | Server | Client |
| `MESSAGE_IN_CHAT`      | Sends message                                                | Both   | Both   |
| `START_TYPING`         | Sends typing message                                         | Both   | Both   |
| `STOP_TYPING`          | Removes typing message                                       | Both   | Both   |
| `SHOW_GAME`            | Shows game board                                             | Server | Client |
| `SHOW_GAME_PLAYER`     | Allows current player to interact with game board            | Server | Client |
| `REMOVE_GAME_PLAYER`   | Removes ability to interact with game board                  | Server | Client |
| `SHOW_STARTED_GAME`    | Shows game board with saved data (for users that join later) | Server | Client |
| `SELECTED_USERS`       | Sends selected users to the client                           | Server | Client |
| `CELL_CLICK`           | Sends cell index to the server                               | Client | Server |
| `GAME_OVER`            | Disables game board and show clear game button               | Server | Client |
| `GAME_OVER_WINNER`     | Sends winner/loser GIF to players                            | Server | Client |
| `USERS_IN_ROOM_DELETE` | Sends updated users in room to the client                    | Server | Client |
| `CLEAR_GAME`           | Clears game board                                            | Server | Client |
