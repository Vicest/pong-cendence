import { goto } from '$app/navigation';
import type { ChannelsChat } from '$lib/types';
import { ChatSocket } from '$services/socket';
import { get, writable } from 'svelte/store';
import { userList } from './User';
import { currentUser } from './Auth';
import { Api } from '$services/api';

export const joinedChannelsChat = writable<ChannelsChat[]>();
export const notJoinedChannelChat = writable<ChannelsChat[]>();

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

export const updateChannel = async (id: number, data) => {
	return Api.put(`/chat/${id}`, data);
};

function createChannelListStore() {
	const { set, subscribe } = writable<ChannelsChat[]>();
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
		iAdmin(id: number) {
			return state.some((c) => c.id === id && c.admins.some((a) => a.id === get(currentUser).id));
		},
		friendSearchList: () => {
			return state
				.filter((channel) => channel.type === 'Direct' && !channel.joined)
				.map((channel) => channel.user);
		},
		chatSearchList: () => {
			return state.filter((channel) => channel.type === 'Channel' && !channel.joined);
		}
	};
}

export const channelList = createChannelListStore();

export const joinChannel = (id: number) => {
	Api.post(`/chat/${id}/join`);
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
					} else if (ch.id === channel.id) {
						ch.users = ch.users.filter((u) => u.id !== userId);
					}
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
