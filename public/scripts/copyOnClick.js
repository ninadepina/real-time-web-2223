const roomId = document.querySelector('.roomId h2 span');

roomId.addEventListener('click', (e) => {
	navigator.clipboard
		.writeText(roomId.textContent)
		.then(() => {
			console.log('ROOM ID copied to clipboard');
		})
		.catch((err) => {
			console.error('Error copying ROOM ID: ', err);
		});
});
