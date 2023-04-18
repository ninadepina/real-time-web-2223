export const createElement = (tagName, props) => {
	const element = document.createElement(tagName);
	Object.assign(element, props);
	return element;
};

export const appendChild = (parent, child) => {
	return parent.appendChild(child);
};
