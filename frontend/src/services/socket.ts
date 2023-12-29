import { PUBLIC_BACKEND_PORT, PUBLIC_BACKEND_BASE } from '$env/static/public';
import { io } from 'socket.io-client';
import { lastError } from '../store/Common';

export const Socket = io(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`, {
	withCredentials: true,
	transports: ['websocket'],
	autoConnect: false
});

export const UsersSocket = io(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}/users`, {
	withCredentials: true,
	transports: ['websocket'],
	autoConnect: false
});

export const GamesSocket = io(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}/games`, {
	withCredentials: true,
	transports: ['websocket'],
	autoConnect: false
});

export const MatchMakingSocket = io(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}/matchmaking`, {
	withCredentials: true,
	transports: ['websocket'],
	autoConnect: false
});

export const ChatSocket = io(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}/chats`, {
	withCredentials: true,
	transports: ['websocket'],
	autoConnect: false
});

[Socket, UsersSocket, GamesSocket, MatchMakingSocket, ChatSocket].forEach((socket) => {
	socket.on('exception', (data) => {
		lastError.set(data.message);
	});
});
