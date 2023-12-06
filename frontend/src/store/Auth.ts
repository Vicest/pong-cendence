import { writable, get } from 'svelte/store';
import { Api } from '$services/api';
import { redirect } from '@sveltejs/kit';
import { Socket } from '../services/socket';
import type { Person } from '$lib/types';

export const loading = writable<boolean>(true);
loading.set(true);

export const currentUser = writable<Person>();

export const init = () => {
	Api.get('/auth/me')
		.then(({ data }) => {
			currentUser.set(data);
			setTimeout(() => {
				loading.set(false);
			}, 1000);
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {});
};
