import home from '../routes/home.js';
import chat from '../routes/chat.js';
import username from '../routes/username.js';

const routes = [
	{ path: '/', view: home },
	{ path: '/chat', view: chat },
	{ path: '/username', view: username },
];

export default routes;