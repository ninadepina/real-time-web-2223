const createElement = (tagName, props) => {
	const element = document.createElement(tagName);
	Object.assign(element, props);
	return element;
};

const appendChild = (parent, child) => {
	return parent.appendChild(child);
};

export { createElement, appendChild };
