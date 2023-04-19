import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import session from 'express-session';
import compression from 'compression';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import chatSocket from './sockets.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import { createServer } from 'http';
const http = createServer(app);
import { Server } from 'socket.io';
const io = new Server(http);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use(
	session({
		name: 'chatsession',
		secret: process.env.SESSION_SECRET,
		saveUninitialized: true,
		resave: false
	})
);

// routes
routes.forEach((route) => {
	app.use(route.path, route.view);
});

app.engine(
	'hbs',
	engine({
		layoutsDir: `${path.join(__dirname)}/views`,
		partialsDir: `${path.join(__dirname)}/views/partials`,
		defaultLayout: 'main',
		extname: '.hbs'
		// helpers: { ...helpers }
	})
);
app.set('view engine', 'hbs');
app.set('views', './views');

//socket.io
io.on('connection', (socket) => {
	chatSocket(io, socket);
});

io.use((socket, next) => {
	const username = socket.handshake.auth.username;

	if (!username) {
		return next(new Error('invalid username'));
	}

	socket.username = username;
	next();
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
