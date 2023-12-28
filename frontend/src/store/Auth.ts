import { writable, get } from 'svelte/store';
import { Api } from '$services/api';
import type { Person } from '$lib/types';
import { goto } from '$app/navigation';

export const loading = writable<boolean>(true);
loading.set(true);

export const currentUser = writable<Person>();

export const init = async () => {
	try {
		let res = await Api.get('/auth/me');
		currentUser.set(res.data);
		if (Date.now() - new Date(get(currentUser).created_at).getTime() < 2500) {
			loading.set(false);
			goto('/app/profile');
			return;
		}
		setTimeout(() => {
			loading.set(false);
		}, 1000);
		return res.data;
	} catch (error) {
		throw error;
	}
};
