import Cookies from 'js-cookie';
import { PUBLIC_BACKEND_PORT, PUBLIC_BACKEND_BASE } from '$env/static/public';
import { io } from 'socket.io-client';

export const Socket = io(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`, {
	withCredentials: true,
	transports: ['websocket']
});

export const UsersSocket = io(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}/users`, {
	withCredentials: true,
	transports: ['websocket']
});

export const GamesSocket = io(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}/games`, {
	withCredentials: true,
	transports: ['websocket']
});
