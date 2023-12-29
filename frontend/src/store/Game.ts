import { get, readable, writable } from 'svelte/store';
import type { Game, GameInstance } from '$lib/types';
import type { DrawerSettings } from '@skeletonlabs/skeleton';
import { userList } from './User';
import { Api } from '$services/api';
import { GamesSocket } from '$services/socket';

export const gameListDrawerSettings = readable<DrawerSettings>({
	id: 'battle-zone',
	bgDrawer: 'text-white',
	width: 'w-[280px] md:w-[480px]',
	padding: 'p-4',
	rounded: 'rounded-xl',
	position: 'right'
});

export const gameList = writable<Game[]>([]);

export const gameInstances = writable<GameInstance[]>([]);

export const init = () => {
	GamesSocket.connect();
	Api.get('/games').then((response) => {
		gameList.set(
			response.data.map((game) => {
				return {
					...game,
					launched_at: new Date(game.launched_at)
				};
			})
		);
	});

	Api.get('/games/matches').then((response) => {
		gameInstances.set(
			response.data.map((match) => {
				return {
					id: match.id,
					game: match.game.id,
					players: match.players.map((matchPlayer) => matchPlayer.user.id),
					created_at: new Date(match.created_at),
					status: match.status
				};
			})
		);
	});

	GamesSocket.on('match:updated', (id, updatedMetadata) => {
		gameInstances.update((matches) => {
			return matches
				.map((match) => {
					if (match.id === id) {
						return { ...match, ...updatedMetadata };
					}
					return match;
				})
				.sort((a, b) => a.id - b.id);
		});
	});

	GamesSocket.on('match:created', (id, match) => {
		gameInstances.update((matches) => {
			return matches.concat({
				...match,
				game: match.game.id,
				players: match.players.map((matchPlayer) => matchPlayer.user.id)
			});
		});
	});
};
