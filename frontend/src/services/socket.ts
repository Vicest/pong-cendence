import { writable } from 'svelte/store'
import { goto } from '$app/navigation';
import Cookies from 'js-cookie';
import { PUBLIC_BACKEND_PORT, PUBLIC_BACKEND_BASE } from '$env/static/public';
import { io } from 'socket.io-client';

export const Socket = io(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`, {
	withCredentials: true,
	extraHeaders: {
		'Authorization': 'Bearer ' + Cookies.get('token') || '',
	}
});
