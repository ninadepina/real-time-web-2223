import home from '../routes/home.js';
import room from '../routes/room.js';
import username from '../routes/username.js';
import leave from '../routes/leave.js';
import error from '../routes/error.js';

const routes = [
	{ path: '/', view: home },
	{ path: '/room', view: room },
	{ path: '/username', view: username }
	{ path: '/leave', view: leave },
	{ path: '*', view: error }
];

export default routes;
