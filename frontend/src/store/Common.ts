import { readable } from 'svelte/store';
import { PUBLIC_BACKEND_PORT, PUBLIC_BACKEND_BASE } from '$env/static/public';

export const ApiUrl = readable(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`);
