import { readable, writable } from 'svelte/store';
import { PUBLIC_BACKEND_PORT, PUBLIC_BACKEND_BASE } from '$env/static/public';
import type { Game } from '$lib/types';

export const ApiUrl = readable(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`);

export const selectedGame = writable<Game | null>(null);

export const lastError = writable<string | null>(null);

