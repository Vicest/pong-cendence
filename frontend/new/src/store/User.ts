import { writable } from 'svelte/store'

export const userList = writable(null);

const getCookie = (name: string) => {
	let cookie = {};
	document.cookie.split(';').forEach(function(el) {
	  let split = el.split('=');
	  cookie[split[0].trim()] = split.slice(1).join("=");
	})
	console.log(cookie);
	return cookie[name];
}

fetch('http://localhost:5001/users/all', {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + getCookie('token'),
	},
})
	.then((res) => res.json())
	.then((data) => {
		userList.set(data);
	});

setTimeout(() => {


}, 3000);


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
