import { writable } from 'svelte/store';
import { Api } from '$services/api';
import type { Person } from '$lib/types';

export const loading = writable<boolean>(true);
loading.set(true);

export const currentUser = writable<Person>();

export const init = async () => {
	try {
		let res = await Api.get('/auth/me');
		res.data.inQueue = false;
		currentUser.set(res.data);
		setTimeout(() => {
			loading.set(false);
		}, 1000);

		return res.data;
	} catch (error) {
		throw error;
	}
};