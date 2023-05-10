import home from '../routes/home.js';
import user from '../routes/user.js';
import room from '../routes/room.js';
import leave from '../routes/leave.js';
import error from '../routes/error.js';

const routes = [
	{ path: '/room', view: room },
	{ path: '/leave', view: leave },
	{ path: '/user', view: user },
	{ path: '/', view: home },
	{ path: '*', view: error }
];

export default routes;
