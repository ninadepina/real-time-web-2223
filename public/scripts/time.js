const format = (n) => {
	return n < 10 ? `0${n}` : n;
};

const timeData = () => {
	const date = new Date();
	const data = {
		year: date.getFullYear().toString(),
		month: format(date.getMonth() + 1).toString(),
		day: format(date.getDate()).toString(),
		h: format(date.getHours()).toString(),
		m: format(date.getMinutes()).toString(),
		s: format(date.getSeconds()).toString()
	};
	return data;
};

export { timeData };
