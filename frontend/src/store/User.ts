import { get, writable } from 'svelte/store';
import { Api } from '$services/api';
import { Socket } from '$services/socket';
import { currentUser } from './Auth';
import { priv_chat_history } from './Chat';

export const loading = writable<boolean>(true);
loading.set(true);

export const userList = writable<
	{
		id: number;
		nickname: string;
		avatar: string;
	}[]
>();

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

Socket.on('user:updated', (updatedUser) => {
	userList.update((users) => {
		return users
			.map((user) => {
				if (user.id === updatedUser.id) {
					return updatedUser;
				}
				return user;
			})
			.sort((a, b) => a.id - b.id);
	});
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
	if (get(currentUser).id === updatedUser.id) {
		currentUser.set(updatedUser);
	}
});

Socket.on('user:created', (createdUser) => {
	userList.update((users) => {
		return [...users, createdUser];
	});
});
