import { writable, get } from 'svelte/store';
import { Api } from '$services/api';
import type { Person } from '$lib/types';

export const loading = writable<boolean>(true);
loading.set(true);

export const currentUser = writable<Person>();

export const currentUserFriends = writable<Person[]>();

export const init = async () => {
	try {
		let res = await Api.get('/auth/me');
		currentUser.set(res.data);
		setTimeout(() => {
			loading.set(false);
		}, 1000);
		res = await Api.get('/users/friends');
		currentUserFriends.set(res.data);
		return res.data;
	} catch (error) {
		throw error;
	}
};
