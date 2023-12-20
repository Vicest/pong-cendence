import { get, writable } from 'svelte/store';
import { Api } from '$services/api';
import { UsersSocket } from '$services/socket';
import { currentUser } from './Auth';
import type { Person } from '$lib/types';

export const loading = writable<boolean>(true);
loading.set(true);

export const userList = writable<Person[]>();

export const init = () => {
	UsersSocket.connect();
	Api.get('/users')
		.then(({ data }) => {
			userList.set(data);
			setTimeout(() => {
				loading.set(false);
			}, 1000);

			UsersSocket.on('user:updated', (id, updatedMetadata) => {
				userList.update((users) => {
					return users
						.map((user) => {
							if (user.id === id) {
								return { ...user, ...updatedMetadata };
							}
							return user;
						})
						.sort((a, b) => a.id - b.id);
				});
				const user = get(currentUser);
				if (user.id === id) {
					currentUser.update((user) => {
						return { ...user, ...updatedMetadata };
					});
				}
			});

			UsersSocket.on('user:created', (createdUser) => {
				userList.update((users) => {
					return [...users, createdUser];
				});
			});
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {});
};
