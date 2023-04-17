import home from '../routes/home.js';
import chat from '../routes/chat.js';

const routes = [
	{ path: '/', view: home },
	{ path: '/chat', view: chat },
];

export default routes;