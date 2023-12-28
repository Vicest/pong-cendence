import { writable } from 'svelte/store';
import { Api } from '$services/api';
import type { Person } from '$lib/types';
import { MatchMakingSocket } from '$services/socket';

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

		MatchMakingSocket.on('user:queue', (status: 'joined' | 'left') => {
			if (status === 'joined')
				currentUser.update((person) => {
					person.inQueue = true;
					return person;
				})
			else if (status === 'left')
				currentUser.update((person) => {
					person.inQueue = false;
					return person;
				})
			else
				console.log('Invalid data for message user:queue');
		})

		return res.data;
	} catch (error) {
		throw error;
	}
};