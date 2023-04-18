import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import routes from './routes/routes.js';
import session from 'express-session';
import compression from 'compression';
import dotenv from 'dotenv';
import { route } from './routes/routes.js';
dotenv.config();

const app = express();
import { createServer } from 'http';
const http = createServer(app);
import { Server } from 'socket.io';
const io = new Server(http);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessionLength = 1000 * 60 * 60 * 24 * 7; // 1 day

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use(
	session({
		name: 'chatsession',
		secret: 'chatsecretsessiondata',
		saveUninitialized: true,
		cookie: { maxAge: sessionLength },
		resave: false
	})
);

// routes
app.use('/', route);

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
// io.on('connect', (socket) => {
// 	console.log('a user connected');

// 	socket.on('message', (message) => {
// 		io.emit('message', message);
// 	});

// 	socket.on('disconnect', () => {
// 		console.log('user disconnected');
// 	});
// });

io.on('connect', (socket) => {
	console.log('a user connected');

	socket.on('username', (username) => {
		socket.data.username = username;
		io.emit('userJoined', `${username} joined the chat`);
	});

	socket.on('message', (message) => {
		const username = socket.data.username;
		io.emit('message', `${username}: ${message}`);
	});

	socket.on('disconnect', () => {
		const username = socket.data.username;
		io.emit('userLeft', `${username} left the chat`);
		console.log('user disconnected');
	});
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
