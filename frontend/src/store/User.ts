import { get, writable } from 'svelte/store';
import { Api } from '$services/api';
import { UsersSocket } from '$services/socket';
import { currentUser } from './Auth';
import type { Person } from '$lib/types';

export const loading = writable<boolean>(true);
loading.set(true);

export const userList = writable<Person[]>();

export const currentUserFriends = writable<Person[]>();

export const blockedMe = (id: number) => {
	const meId = get(currentUser).id;
	return (
		get(userList)
			.find((user) => user.id === id)
			?.blocked.some((user) => user.id === meId) ?? false
	);
};

export const blockedByMe = (id: number) => {
	const meId = get(currentUser).id;
	return (
		get(userList)
			.find((user) => user.id === meId)
			?.blocked.some((user) => user.id === id) ?? false
	);
};

export const isBlocked = (id: number) => {
	return blockedMe(id) || blockedByMe(id);
};

export const acceptUser = (id: number) => {
	return Api.post(`/users/${id}/accept`);
};

export const rejectUser = (id: number) => {
	return Api.delete(`/users/${id}/accept`);
};

export const sendFriendRequest = (id: number) => {
	return Api.post(`/users/${id}/friend`);
};

export const cancelFriendRequest = (id: number) => {
	return Api.delete(`/users/${id}/friend`);
};

export const removeFriend = (id: number) => {
	return Api.delete(`/users/friends/${id}`);
};

export const blockUser = (id: number) => {
	return Api.post(`/users/${id}/block`);
};

export const unblockUser = (id: number) => {
	return Api.delete(`/users/${id}/block`);
};

export const init = () => {
	UsersSocket.connect();
	Api.get('/users')
		.then(({ data }) => {
			userList.set(data);
			setTimeout(() => {
				loading.set(false);
			}, 1000);

			Api.get('/users/friends').then(({ data }) => {
				currentUserFriends.set(data);
			});

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

			UsersSocket.on('user:friend_removed', ({ from, to }: { from: Person; to: Person }) => {
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === (from.id === get(currentUser).id ? from : to).id) {
							u.friends = u.friends.filter((u) => u.id !== to.id);
							u.invitations = u.invitations.filter((u) => u.id !== to.id);
						}
						return u;
					});
				});
				if (from.id === get(currentUser).id) {
					currentUserFriends.update((users) => {
						return users.filter((u) => u.id !== to.id);
					});
				}
			});

			UsersSocket.on('user:blocked', ({ from, to }: { from: Person; to: Person }) => {
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === (from.id === get(currentUser).id ? from : to).id) {
							u.blocked = [...u.blocked, to];
						}
						return u;
					});
				});
			});

			UsersSocket.on('user:unblocked', ({ from, to }: { from: Person; to: Person }) => {
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === (from.id === get(currentUser).id ? from : to).id) {
							u.blocked = u.blocked.filter((u) => u.id !== to.id);
						}
						return u;
					});
				});
			});

			UsersSocket.on('user:unblocked', ({ from, to }: { from: Person; to: Person }) => {
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === (from.id === get(currentUser).id ? from : to).id) {
							u.blocked = u.blocked.filter((u) => u.id !== from.id);
						}
						return u;
					});
				});
			});

			UsersSocket.on('user:friend_request', ({ from, to }: { from: Person; to: Person }) => {
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === (from.id === get(currentUser).id ? from : to).id) {
							u.invitations = [...u.invitations, to];
							console.log(u);
						}
						return u;
					});
				});
			});

			UsersSocket.on(
				'user:friend_request_cancelled',
				({ from, to }: { from: Person; to: Person }) => {
					userList.update((users) => {
						return users.map((u) => {
							if (u.id === (from.id === get(currentUser).id ? from : to).id) {
								u.invitations = u.invitations.filter((u) => u.id !== to.id);
							}
							return u;
						});
					});
				}
			);
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {});
};
