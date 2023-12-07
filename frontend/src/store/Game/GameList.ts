import { readable, writable } from 'svelte/store';
import type { Game } from '$lib/types';
import type { DrawerSettings } from '@skeletonlabs/skeleton';

export const gameListDrawerSettings = readable<DrawerSettings>({
	id: 'battle-zone',
	// Provide your property overrides:
	bgDrawer: 'text-white',
	width: 'w-[280px] md:w-[480px]',
	padding: 'p-4',
	rounded: 'rounded-xl',
	position: 'right'
});

export const gameList = readable<Game[]>([
	{
		name: 'Pong',
		cover: '/images/pong/cover.png',
		title: 'Play Pong with your friends',
		description:
			'Pong is a classic arcade video game that simulates table tennis. It features simple two-dimensional graphics and involves players controlling paddles to hit a ball back and forth. Its straightforward gameplay and minimalist design made it a massive hit, establishing it as a pioneering title in the world of video games.',
		create_at: new Date('1972-11-29'),
		author: 'Atari Inc.',
		enabled: true
	},
	{
		name: 'Tetris',
		cover: '/images/tetris/cover.png',
		title: 'Play Tetris with your friends',
		description:
			'Tetris is a tile-matching video game created by Russian software engineer Alexey Pajitnov in 1984. It has been published by several companies, most prominently during a dispute over the appropriation of the rights in the late 1980s. After a significant period of publication by Nintendo, the rights reverted to Pajitnov in 1996, who co-founded The Tetris Company with Henk Rogers to manage Tetris licensing. In 2007, the game had sold more than 100 million copies for cell phones alone, had been downloaded more than 500 million times for mobile phones, and had been played more than 1 billion times online.',
		create_at: new Date('1984-06-06'),
		author: 'Alexey Pajitnov',
		enabled: false
	}
]);

export const selectedGame = writable<Game | null>(null);
