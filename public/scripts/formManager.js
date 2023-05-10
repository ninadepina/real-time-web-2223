const form = document.querySelector('.join_create_room');
const buttons = form.querySelectorAll('.room_btn');
const joinCreate = document.querySelector('.join_create');
const roomIdContainer = document.querySelector('.room_id_container');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	buttons.forEach((button) => button.classList.toggle('active', button === e.submitter));
	joinCreate.value = e.submitter.value === 'create-room' ? 'create' : 'join';
	roomIdContainer.classList.toggle('hide', e.submitter.value !== 'join-room');
});
