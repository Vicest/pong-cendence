import { get, writable } from 'svelte/store';
import { Api } from '$services/api';
import { ChatSocket, GamesSocket, MatchMakingSocket, Socket, UsersSocket } from '$services/socket';
import { currentUser } from './Auth';
import type { Person } from '$lib/types';
import { goto } from '$app/navigation';

function createUserListStore() {
	const { set, subscribe } = writable<Person[]>([]);
	let state: Person[] = [];
	subscribe((v) => (state = v));
	return {
		subscribe,
		set,
		update: (fn: (users: Person[]) => Person[]) => {
			set(fn(state));
		},
		get: () => state,
		find: (id: number) => {
			return state.find((u) => u.id === id);
		},
		findByNickname: (name: string) => {
			return state.find((u) => u.nickname === name);
		},
		isAdmin(id: number) {
			return state.find((u) => u.id === id)?.isAdmin ?? false;
		},
		isBanned(id: number) {
			return state.find((u) => u.id === id)?.isBanned ?? false;
		},
		invitedByMe: (id: number) => {
			return (
				state
					.find((user) => user.id === get(currentUser).id)
					?.invitations.some((user) => user.id === id) ?? false
			);
		},
		invitedMe: (id: number) => {
			return (
				state
					.find((user) => user.id === id)
					?.invitations.some((user) => user.id === get(currentUser).id) ?? false
			);
		},
		blockedByMe: (id: number) => {
			return (
				state
					.find((user) => user.id === get(currentUser).id)
					?.blocked.some((user) => user.id === id) ?? false
			);
		},
		blockedMe: (id: number) => {
			return (
				state
					.find((user) => user.id === id)
					?.blocked.some((user) => user.id === get(currentUser).id) ?? false
			);
		},
		areFriends: (id: number) => {
			return (
				state
					.find((user) => user.id === get(currentUser).id)
					?.friends.some((user) => user.id === id) ?? false
			);
		},
		getMyFriends: () => {
			const me = state.find((user) => user.id === get(currentUser).id) as Person;
			return state.filter((user) => user.friends.some((u) => u.id === me.id));
		}
	};
}

export const userList = createUserListStore();

export const loading = writable<boolean>(true);
loading.set(true);

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

export const banUser = (id: number) => {
	return Api.post(`/users/${id}/ban`);
};

export const unbanUser = (id: number) => {
	return Api.delete(`/users/${id}/ban`);
};

export const init = async () => {
	UsersSocket.connect();
	await Api.get('/users')
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
					if (typeof updatedMetadata.isBanned === 'boolean' && updatedMetadata.isBanned) {
						console.log('banned');
						[Socket, UsersSocket, GamesSocket, MatchMakingSocket, ChatSocket].forEach((s) => {
							s.disconnect();
						});
						document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
						document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
						goto('/banned');
					}
					currentUser.update((user) => {
						return { ...user, ...updatedMetadata };
					});
				}
			});

			UsersSocket.on('user:created', (id, createdUser) => {
				userList.update((users) => {
					if (typeof createdUser.friends === 'undefined') {
						createdUser.friends = [];
					}
					if (typeof createdUser.invitations === 'undefined') {
						createdUser.invitations = [];
					}
					if (typeof createdUser.blocked === 'undefined') {
						createdUser.blocked = [];
					}
					return [...users, createdUser];
				});
			});

			UsersSocket.on('user:friend_removed', ({ from, to }: { from: Person; to: Person }) => {
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === from.id) {
							u.friends = u.friends.filter((u) => u.id !== to.id);
							u.invitations = u.invitations.filter((u) => u.id !== to.id);
							u.blocked = u.blocked.filter((u) => u.id !== to.id);
						} else if (u.id === to.id) {
							u.friends = u.friends.filter((u) => u.id !== from.id);
							u.invitations = u.invitations.filter((u) => u.id !== from.id);
							u.blocked = u.blocked.filter((u) => u.id !== from.id);
						}
						return u;
					});
				});
			});

			UsersSocket.on('user:blocked', ({ from, to }: { from: Person; to: Person }) => {
				userList.update((users) => {
					return users.map((u) => {
						if (u.id === from.id) {
							u.blocked = [...u.blocked, to];
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

			GamesSocket.on('match:updated', async (matchId: number, match) => {
				console.log('I listened');
				//TODO if match is finished update ranking???
				if (match.status !== 'finished') return;
				get(currentUser).rank = await Api.get(`/users/${get(currentUser).id}/rank`);
				console.log(`Id: ${matchId}\nMatch: ${JSON.stringify(match)}`);
			});

			return data;
		})
		.catch((err) => {
			console.log(err);
		})
		.finally(() => {});

	userList.update( (persons: Person[]) => {
		for (let userIdx in persons) {
			Api.get(`/users/${persons[userIdx].id}/history`).then((matchHistory) => {
				//console.log('History: ', matchHistory.data);
				persons[userIdx].history = matchHistory.data;
			}).catch();
		}
		return persons;
	});
};
