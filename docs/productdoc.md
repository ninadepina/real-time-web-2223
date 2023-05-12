# 'TIC TAC TOE' - Documentation

During the [Real-Time Web](https://github.com/cmda-minor-web/real-time-web-2223) course, we were asked to build a real-time application.

**Goals of this course:**

-   _deal with real-time complexity;_
-   _handle real-time client-server interaction;_
-   _handle real-rime data management;_
-   _handle multi-user support._

## Concept
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

### Design
![design landing page](https://github.com/ninadepina/tic-tac-toe/assets/89778503/33cf9b82-1179-47b0-bf8e-7a2d79e4a719)
![design room page](https://github.com/ninadepina/tic-tac-toe/assets/89778503/5e61beb8-61ff-434d-9196-0a7123e4cde8)

## Data life cycle

> A data life cycle refers to (a visual representation of) the different stages involved in the transfer of data over a network socket.

The life cycle of this application starts at the homescreen, where users have the option to either create a new room or join an existing one. This user data is exchanged between the client and server through a fetch to `/user/:esi`. When trying to join a room with a username that's already present in the room, the server will send back an error message.

Upon room join, a loader will be shown, then the room. The room will show the current players in the room, the chat and the start game button. When the room contains 2 or more users, the start button can be clicked and 2 players from the chat will randomly get selected. These 2 players will be able to play a game of Tic Tac Toe. The other users will be able to spectate the game. When the game is over, everyone will be able to clear the game and start a new one.
![datalifecycle](https://github.com/ninadepina/tic-tac-toe/assets/89778503/3070fd8a-8f73-409d-9a81-65ad77796724)

