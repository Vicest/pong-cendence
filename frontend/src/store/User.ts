import { get, writable } from 'svelte/store';
import { Api } from '$services/api';
import { GamesSocket, Socket, UsersSocket } from '$services/socket';
import { currentUser } from './Auth';
import type { Person } from '$lib/types';
import { priv_msg, priv_chat_history, receptor } from './Chat';

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
				priv_msg.update((messages) => {
					return messages.map((message) => {
						const target = message.sender.id === updatedMetadata.id ? 'sender' : 'target';
						if (target) {
							return {
								...message,
								[target]: {
									...(message[target] as Person),
									nickname: updatedMetadata.nickname
								}
							};
						}
						return message;
					});
				});

				if (get(receptor)) {
					priv_chat_history.set(
						get(priv_msg)
							.filter((msg: any) => {
								return (
									msg.sender.nickname == get(receptor).nickname ||
									msg.receiver.nickname == get(receptor).nickname
								);
							})
							.sort((msgA: any, msgB: any) => {
								const dateA = new Date(msgA.created_at).getTime();
								const dateB = new Date(msgB.created_at).getTime();
								return dateA - dateB;
							})
					);
				}
			});

			UsersSocket.on('user:created', (createdUser) => {
				userList.update((users) => {
					console.log('user:created -> ', createdUser);
					return [...users, createdUser];
				});
			});
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {});
};
