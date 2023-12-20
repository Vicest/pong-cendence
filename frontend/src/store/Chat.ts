import { goto } from '$app/navigation';
import type { ChannelsChat } from '$lib/types';
import { ChatSocket } from '$services/socket';
import { get, writable } from 'svelte/store';
import { userList } from './User';
import { currentUser } from './Auth';

export const channelsChat = writable<ChannelsChat[]>();

export const init = () => {
	ChatSocket.connect();

	ChatSocket.on('rooms', (rooms) => {
		channelsChat.set(rooms);
	});

	ChatSocket.on('channel_message', (data: { channel: number; message: string; sender: number }) => {
		channelsChat.update((channels) => {
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
};
