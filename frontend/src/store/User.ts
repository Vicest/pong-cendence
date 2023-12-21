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

export const acceptUser = (id: number) => {
	return Api.post(`/users/${id}/accept`);
};

export const rejectUser = (id: number) => {
	return Api.delete(`/users/${id}/accept`);
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
						if (u.id === from.id) {
							u.friends = u.friends.filter((u) => u.id !== to.id);
							u.invitations = u.invitations.filter((u) => u.id !== to.id);
						} else if (u.id === to.id) {
							u.friends = u.friends.filter((u) => u.id !== from.id);
							u.invitations = u.invitations.filter((u) => u.id !== from.id);
						}
						return u;
					});
				});
				if (from.id === get(currentUser).id) {
					currentUserFriends.update((users) => {
						return users.filter((u) => u.id !== to.id);
					});
				} else if (to.id === get(currentUser).id) {
					currentUserFriends.update((users) => {
						return users.filter((u) => u.id !== from.id);
					});
				}
			});

			UsersSocket.on('user:blocked', ({ from, to }: { from: Person; to: Person }) => {
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === from.id) {
							u.blocked = [...u.blocked, to];
						} else if (u.id === to.id) {
							u.blocked = [...u.blocked, from];
						}
						return u;
					});
				});
			});

			UsersSocket.on('user:unblocked', ({ from, to }: { from: Person; to: Person }) => {
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === from.id) {
							u.blocked = u.friends.filter((u) => u.id !== to.id);
						}
						return u;
					});
				});
			});

			UsersSocket.on('user:friend_request', ({ from, to }: { from: Person; to: Person }) => {
				console.log('friend_request', from, to, get(userList));
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === from.id) u.invitations = [...u.invitations, to];
						return u;
					});
				});
			});

			UsersSocket.on(
				'user:friend_request_accepted',
				({ from, to }: { from: Person; to: Person }) => {
					userList.update((users) => {
						let a = users.map((u) => {
							if (from.id === u.id) {
								console.log('from', from);
								u.friends = [...u.friends, to];
								u.invitations = u.invitations.filter((u) => u.id !== to.id);
							} else if (to.id === u.id) {
								u.friends = [...u.friends, from];
								u.invitations = u.invitations.filter((u) => u.id !== from.id);
							}
							return u;
						});
						console.log(a);
						return a;
					});
					if (from.id === get(currentUser).id) {
						currentUserFriends.update((users) => {
							return [...users, to];
						});
					} else if (to.id === get(currentUser).id) {
						currentUserFriends.update((users) => {
							return [...users, from];
						});
					}
				}
			);

			UsersSocket.on(
				'user:friend_request_cancelled',
				({ from, to }: { from: Person; to: Person }) => {
					userList.update((users) => {
						return users.map((u) => {
							u.invitations = u.invitations.filter((u) => u.id !== to.id);
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
