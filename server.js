import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { engine } from 'express-handlebars';
import session from 'express-session';
import compression from 'compression';

import routes from './routes/routes.js';
import helpers from './utils/helpers.js';
import chatSocket from './sockets.js';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import { createServer } from 'http';
const http = createServer(app);
import { Server } from 'socket.io';
const io = new Server(http);

app.locals.fs = fs;

app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public/'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use(
	session({
		name: 'chatsession',
		secret: process.env.SESSION_SECRET,
		saveUninitialized: true,
		cookie: { maxAge: 604800000 },
		resave: false
	})
);

app.engine(
	'hbs',
	engine({
		layoutsDir: `${path.join(__dirname)}/views`,
		partialsDir: `${path.join(__dirname)}/views/partials`,
		defaultLayout: 'main',
		extname: '.hbs',
		helpers: { ...helpers }
	})
);
app.set('view engine', 'hbs');
app.set('views', 'views');

// socket.io
io.on('connection', (socket) => {
	chatSocket(io, socket);
});

io.use((socket, next) => {
	const username = socket.handshake.auth.username;
	const roomId = socket.handshake.auth.roomId;

	if (!username) {
		return next(new Error('invalid username'));
	}
	if (!roomId) {
		return next(new Error('invalid roomId'));
	}

	socket.username = username;
	socket.roomId = roomId;

	next();
});

// routes
routes.forEach((route) => {
	app.use(route.path, route.view);
});

// port
const port = process.env.PORT || 2222;
http.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
