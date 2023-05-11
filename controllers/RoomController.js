import fs from 'fs';
const roomsFile = JSON.parse(fs.readFileSync('./data/rooms.json'));
let rooms = roomsFile.rooms;

class RoomController {
	constructor() {
		this.isConnected = true;
		this.roomObject = {};
	}

	getRoomId = () => {
		const roomId = this.genRoomId();
		return roomId;
	};

	genRoomId() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result;

		do {
			result = Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
		} while (rooms[result]);

		rooms.push(result);
		
		fs.writeFile('./data/rooms.json', JSON.stringify({ rooms: rooms }), (err) => {
			if (err) throw err;
		});

		return result;
	}

	roomIdExist = (code) => {
		if (roomsFile.rooms.includes(code)) return true;
		return false;
	};

	deleteRoomFromJson = (code) => {
		const currentRooms = roomsFile.rooms;

		let index = currentRooms.indexOf(code);

		if (index !== -1) currentRooms.splice(index, 1);

		fs.writeFile('./data/rooms.json', JSON.stringify({ rooms: currentRooms }), (err) => {
			if (err) throw err;
			console.log('Room code deleted from file');
		});
	};

	listRoomUsers = (roomObject) => {
		if (!roomObject || typeof roomObject !== 'object') return [];

		const usernamesInRoom = Object.keys(roomObject).map((key) => {
			return roomObject[key].username;
		});

		return usernamesInRoom;
	};

	setConnectionState = (bool) => {
		this.isConnected = bool;
	};

	getConnectionState = () => {
		return this.isConnected;
	};
}

export default RoomController;
