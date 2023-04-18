export default (io, socket) => {
	const username = socket.username;

	socket.on('new_user', (username) => {
		socket.broadcast.emit('new_user', `${username} joined the chat`);
	});

	socket.on('message', (msg) => {
		io.emit('message', { sender: msg.sender, message: msg.message });
	});

	socket.on('disconnect', () => {
		socket.broadcast.emit('left_user', `${username} left the chat`);
	});
};
