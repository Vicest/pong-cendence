import axios from 'axios';
import { writable } from 'svelte/store'
import { PUBLIC_BACKEND_PORT, PUBLIC_BACKEND_BASE } from '$env/static/public';

const getCookie = (name: string) => {
	let cookie = {};
	if (typeof document === 'undefined') return;
	document.cookie.split(';').forEach(function (el) {
		let split = el.split('=');
		cookie[split[0].trim()] = split.slice(1).join("=");
	})
	return cookie[name];
}
export const Api = axios.create({
	baseURL: `${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`,
	headers: {
		'Authorization': 'Bearer ' + getCookie('token') || '',
		'Content-Type': 'application/json'
	},
	withCredentials: true

});
export const ApiUrl = writable(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`);

