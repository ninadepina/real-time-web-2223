const ul = document.querySelector('.gif_container ul');
ul.classList.remove('visible');

export const fetchGIF = async (obj) => {
	let state;
	obj === 'winner' ? (state = 'winner') : (state = 'loser');

	const url = `https://api.giphy.com/v1/gifs/search?q=${state}&api_key=454o81odJoh3KwZ3JkOnWu33emb4oRy8&limit=50`;

	try {
		const data = await (await fetch(url)).json();
		const randomNumber = Math.floor(Math.random() * data.data.length);

		return data.data[randomNumber].images.original.url;
	} catch (err) {
		console.error(err);
	}
};
