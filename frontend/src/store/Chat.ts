import { goto } from '$app/navigation';
import type { ChannelsChat } from '$lib/types';
import { ChatSocket } from '$services/socket';
import { get, writable } from 'svelte/store';
import { userList } from './User';
import { currentUser } from './Auth';
import { Api } from '$services/api';

export const joinedChannelsChat = writable<ChannelsChat[]>();
export const notJoinedChannelChat = writable<ChannelsChat[]>();

export const joinChannel = (id: number) => {
	Api.post(`/chat/${id}/join`);
};

export const init = () => {
	ChatSocket.connect();

	ChatSocket.on(
		'rooms',
		({
			joinedChannels,
			notJoinedChannels
		}: {
			joinedChannels: ChannelsChat[];
			notJoinedChannels: ChannelsChat[];
		}) => {
			joinedChannelsChat.set(joinedChannels);
			notJoinedChannelChat.set(notJoinedChannels);
		}
	);

	ChatSocket.on('channel_message', (data: { channel: number; message: string; sender: number }) => {
		joinedChannelsChat.update((channels) => {
			return channels.map((channel) => {
				if (channel.id === data.channel) {
					console.log(data);
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
			if (userId === get(currentUser).id) {
				joinedChannelsChat.update((channels) => {
					return [...channels, channel];
				});
				notJoinedChannelChat.update((channels) => {
					return channels.filter((ch) => ch.id !== channel.id);
				});
			} else {
				joinedChannelsChat.update((channels) => {
					return channels.map((ch) => {
						if (ch.id === channel.id) {
							ch.users.push(get(userList).find((user) => user.id === userId));
						}
						return ch;
					});
				});
			}
		}
	);

	ChatSocket.on('channel:created', (channel: ChannelsChat) => {
		joinedChannelsChat.update((channels) => {
			return [...channels, channel];
		});
	});

	ChatSocket.on('channel:deleted', (channel: ChannelsChat) => {
		joinedChannelsChat.update((channels) => {
			return channels.filter((ch) => ch.id !== channel.id);
		});
	});
};
