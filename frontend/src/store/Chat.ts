import { goto } from '$app/navigation';
import type { ChannelsChat } from '$lib/types';
import { ChatSocket } from '$services/socket';
import { get, writable } from 'svelte/store';
import { userList } from './User';
import { currentUser } from './Auth';
import { Api } from '$services/api';

export const sendJoinChanneldRequest = (id: number) => {
	return Api.post(`/chat/${id}/join`);
};

export const sendLeaveChanneldRequest = (id: number) => {
	return Api.post(`/chat/${id}/leave`);
};

export const sendCreateChanneldRequest = (data) => {
	return Api.post('/chat', { data });
};

export const sendDeleteChanneldRequest = async (id: number) => {
	return await Api.delete(`/chat/${id}`);
};

export const kickUserFromChannel = async (id: number, userId: number) => {
	return Api.post(`/chat/${id}/kick/${userId}`);
};

export const banUserFromChannel = async (id: number, userId: number) => {
	return Api.post(`/chat/${id}/ban/${userId}`);
};

export const unBanUserFromChannel = async (id: number, userId: number) => {
	return Api.delete(`/chat/${id}/ban/${userId}`);
};

export const unAdminUserFromChannel = async (id: number, userId: number) => {
	return Api.delete(`/chat/${id}/admin/${userId}`);
};

export const adminUserFromChannel = async (id: number, userId: number) => {
	return Api.post(`/chat/${id}/admin/${userId}`);
};

export const muteUserFromChannel = async (id: number, userId: number, time: number) => {
	return Api.post(`/chat/${id}/mute/${userId}`, { data: { time } });
};

export const unMuteUserFromChannel = async (id: number, userId: number) => {
	return Api.delete(`/chat/${id}/mute/${userId}`);
};

export const updateChannel = async (id: number, data) => {
	return Api.put(`/chat/${id}`, data);
};

function createChannelListStore() {
	const { set, subscribe } = writable<ChannelsChat[]>([]);
	let state: ChannelsChat[] = [];
	subscribe((v) => (state = v));
	return {
		subscribe,
		get,
		set,
		update: (fn: (channels: ChannelsChat[]) => ChannelsChat[]) => {
			set(fn(state));
		},
		find: (id: number) => {
			return state.find((c) => c.id === id);
		},
		joined(id: number) {
			return state.some((c) => c.id === id);
		},
		iJoined(id: number) {
			return state.some((c) => c.id === id && c.joined);
		},
		iOwn(id: number) {
			return state.some((c) => c.id === id && c.owner.id === get(currentUser).id);
		},
		isOwner(id: number, userId: number) {
			return state.some((c) => c.id === id && c.owner.id === userId);
		},
		iAdmin(id: number) {
			return state.some((c) => c.id === id && c.admins.some((a) => a.id === get(currentUser).id));
		},
		isAdmin(id: number, userId: number) {
			return state.some((c) => c.id === id && c.admins.some((a) => a.id === userId));
		},
		isMuted(id: number, userId: number) {
			return state.some((c) => c.id === id && c.muted.some((a) => a.user.id === userId));
		},
		getMuteTime(id: number, userId: number) {
			let time = state.find((c) => c.id === id)?.muted.find((a) => a.user.id === userId)?.expire;
			if (!time) return 0;
			let timeDiff = new Date(time).getTime() - new Date().getTime();
			return (
				Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) +
				24 * Math.floor(timeDiff / (1000 * 60 * 60 * 24)) +
				'h' +
				Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)) +
				'm' +
				Math.floor((timeDiff % (1000 * 60)) / 1000) +
				's'
			);
		},
		iMuted(id: number) {
			return state.some(
				(c) => c.id === id && c.muted.some((a) => a.user.id === get(currentUser).id)
			);
		},
		isBanned(id: number, userId: number) {
			return state.some((c) => c.id === id && c.banned.some((a) => a.id === userId));
		},
		friendSearchList: () => {
			return get(userList).filter(
				(user) => !user.friends.some((f) => f.id === get(currentUser).id)
			);
		},
		chatSearchList: () => {
			return state.filter((channel) => channel.type === 'Channel' && !channel.joined);
		}
	};
}

export const channelList = createChannelListStore();

export const joinChannel = (id: number, password?: string) => {
	Api.post(`/chat/${id}/join`, typeof password !== 'undefined' ? { data: { password } } : {});
};

export const init = () => {
	ChatSocket.connect();

	ChatSocket.on('rooms', (data) => channelList.set(data));

	ChatSocket.on('channel_message', (data: { channel: number; message: string; sender: number }) => {
		channelList.update((channels) => {
			return channels.map((channel) => {
				if (channel.id === data.channel) {
					channel.messages.push({
						id: Math.random(),
						content: data.message,
						created_at: new Date(),
						sender: get(userList).find((user) => user.id === data.sender)
					});
				}
				return channel;
			});
		});
	});

	ChatSocket.on(
		'channel:joined',
		({ userId, channel }: { userId: number; channel: ChannelsChat }) => {
			channelList.update((channels) => {
				return channels.map((ch) => {
					if (ch.id === channel.id && userId === get(currentUser).id) {
						channel.joined = true;
						return channel; // In order to retrieve users property from new channel
					} else if (ch.id === channel.id) {
						ch.users.push(get(userList).find((u) => u.id === userId));
					}
					return ch;
				});
			});
		}
	);

	ChatSocket.on(
		'channel:left',
		({ userId, channel }: { userId: number; channel: ChannelsChat }) => {
			channelList.update((channels) => {
				return channels.map((ch) => {
					if (ch.id === channel.id && userId === get(currentUser).id) {
						ch.joined = false;
					}
					if (ch.id === channel.id) {
						ch.users = ch.users.filter((u) => u.id !== userId);
					}
					return ch;
				});
			});
		}
	);

	ChatSocket.on(
		'channel:banned',
		({ userId, channel }: { userId: number; channel: ChannelsChat }) => {
			channelList.update((channels) => {
				return channels.map((ch) => {
					if (ch.id === channel.id) ch.banned.push(get(userList).find((u) => u.id === userId));
					return ch;
				});
			});
		}
	);

	ChatSocket.on(
		'channel:unbanned',
		({ userId, channel }: { userId: number; channel: ChannelsChat }) => {
			channelList.update((channels) => {
				return channels.map((ch) => {
					if (ch.id === channel.id) ch.banned = ch.banned.filter((u) => u.id !== userId);
					return ch;
				});
			});
		}
	);

	ChatSocket.on(
		'channel:admined',
		({ userId, channel }: { userId: number; channel: ChannelsChat }) => {
			channelList.update((channels) => {
				return channels.map((ch) => {
					if (ch.id === channel.id) ch.admins.push(get(userList).find((u) => u.id === userId));
					return ch;
				});
			});
		}
	);

	ChatSocket.on(
		'channel:unadmined',
		({ userId, channel }: { userId: number; channel: ChannelsChat }) => {
			channelList.update((channels) => {
				return channels.map((ch) => {
					if (ch.id === channel.id) ch.admins = ch.admins.filter((u) => u.id !== userId);
					return ch;
				});
			});
		}
	);

	ChatSocket.on(
		'channel:muted',
		({ userId, channel, muted }: { userId: number; channel: ChannelsChat; muted: any }) => {
			channelList.update((channels) => {
				return channels.map((ch) => {
					if (ch.id === channel.id) {
						console.log(muted);
						ch.muted.push({
							...muted,
							user: get(userList).find((u) => u.id === userId)
						});
					}
					return ch;
				});
			});
		}
	);

	ChatSocket.on(
		'channel:unmuted',
		({ userId, channel }: { userId: number; channel: ChannelsChat }) => {
			channelList.update((channels) => {
				return channels.map((ch) => {
					if (ch.id === channel.id) ch.muted = ch.muted.filter((m) => m.user.id !== userId);
					return ch;
				});
			});
		}
	);

	ChatSocket.on('channel:created', (channel: ChannelsChat) => {
		channelList.update((channels) => {
			return [
				...channels,
				{
					...channel,
					joined: true,
					messages: []
				}
			];
		});
	});

	ChatSocket.on('channel:updated', (channel: ChannelsChat) => {
		channelList.update((channels) => {
			return channels.map((ch) => {
				if (ch.id === channel.id) {
					return {
						...ch,
						...channel
					};
				}
				return ch;
			});
		});
	});

	ChatSocket.on('channel:deleted', (channel: ChannelsChat) => {
		channelList.update((channels) => {
			return channels.filter((ch) => ch.id !== channel.id);
		});
	});
};
