import { writable } from 'svelte/store'
import { Api } from './Api';
import { redirect } from '@sveltejs/kit';

export const loading = writable<boolean>(true);
loading.set(true);

export const currentUser = writable<{
    id: string
    nickname: string,
    avatar: string,
}>();

Api.get('/auth/me')
	.then(({data}) => {
		currentUser.set(data);
        setTimeout(() => {
			loading.set(false);
		}, 1000);
	})
	.catch((err) => {
        console.log(err);
	})
	.finally(() => {

	});
