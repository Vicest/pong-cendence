import { get, writable } from 'svelte/store';
import { Api } from '$services/api';
import { Socket } from '$services/socket';
import { currentUser } from './Auth';

export const loading = writable<boolean>(true);
loading.set(true);

export const userList = writable<
	{
		id: number;
		nickname: string;
		avatar: string;
	}[]
>();

export const init = () => {
	Api.get('/users')
		.then(({ data }) => {
			userList.set(data);
			setTimeout(() => {
				loading.set(false);
			}, 1000);
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {});
};

Socket.on('user:updated', (updatedUser) => {
	if (get(currentUser).id === updatedUser.id) {
		userList.update((users) => {
			return users.map((user) => {
				if (user.id === updatedUser.id) {
					return updatedUser;
				}
				return user;
			});
		});
		currentUser.set(updatedUser);
	}
});
