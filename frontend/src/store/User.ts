import { get, writable } from 'svelte/store';
import { Api } from '$services/api';
import { UsersSocket } from '$services/socket';
import { currentUser } from './Auth';
import type { Person } from '$lib/types';
import { priv_chat_history } from './Chat';

export const loading = writable<boolean>(true);
loading.set(true);

export const userList = writable<Person[]>();

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
	priv_chat_history.update((messages) => {
		return messages.map((message) => {
			if (message.sender.id === updatedUser.id) {
				return {
					...message,
					sender: {
						...message.sender,
						nickname: updatedUser.nickname,
						avatar: updatedUser.avatar
					}
				};
			} else if (message.receiver.id === updatedUser.id) {
				return {
					...message,
					receiver: {
						...message.receiver,
						nickname: updatedUser.nickname,
						avatar: updatedUser.avatar
					}
				};
			}
			return message;
		});
	});
});

UsersSocket.on('user:created', (createdUser) => {
	userList.update((users) => {
		return [...users, createdUser];
	});
});
