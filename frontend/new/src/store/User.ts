import { writable } from 'svelte/store';
import { Api } from './Api';

export const user = writable();
export const userList = writable(null);
let url: any;


const getCookie = (name: string) => {
	let cookie = {};
	document.cookie.split(';').forEach(function (el) {
		let split = el.split('=');
		cookie[split[0].trim()] = split.slice(1).join("=");
	})
	console.log(cookie);
	return cookie[name];
}
// http://back-container:3000
Api.get('/users/all')
	.then((res) => {
		userList.set(res.data);
	})
	.catch((err) => {
		console.log(err);
	});

// setTimeout(() => {


// }, 3000);


export const updateUser = (id: number) => {
	userList.update((user) => {
		return user.map((u) => {
			if (u.id === id) {
				return {
					...u,
					name: 'updated',
				};
			}
			return u;
		});
	});
}
