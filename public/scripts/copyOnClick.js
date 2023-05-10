const roomId = document.querySelector('.roomId h2 span');

roomId.addEventListener('click', async () => {
	try {
		await navigator.clipboard.writeText(roomId.textContent);
		console.log('ROOM ID copied to clipboard');
	} catch (err) {
		console.error('Error copying ROOM ID:', err);
	} finally {
		roomId.setAttribute('data-tooltip', 'copied to clipboard');
		setTimeout(() => roomId.setAttribute('data-tooltip', ''), 500);
	}
});
