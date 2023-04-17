import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import routes from './routes/routes.js';
import compression from 'compression';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
import { createServer } from 'http';
const http = createServer(app);
import { Server } from 'socket.io';
const io = new Server(http);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(compression());

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

// routes
routes.forEach((route) => {
	app.use(route.path, route.view);
});

//socket.io
io.on('connect', (socket) => {
	console.log('a user connected');

	socket.on('message', (message) => {
		io.emit('message', message);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
