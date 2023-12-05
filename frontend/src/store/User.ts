import { writable } from 'svelte/store'
import { Api } from './Api';

export const loading = writable<boolean>(true);
loading.set(true);

export const userList = writable<{
    id: string
    nickname: string,
    avatar: string,
}[]>();

Api.get('/users/all')
	.then(({data}) => {
		userList.set(data);
        setTimeout(() => {
			loading.set(false);
		}, 1000);
	})
	.catch((err) => {
        console.log(err);
	})
	.finally(() => {

	});
