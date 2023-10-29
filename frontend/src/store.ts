import { writable } from 'svelte/store';

// sender: 'mortiz-d', receptor: 'mortiz-d', date: '5:33 AM', content: 'hola'
type msg = {
    sender: string,
    receptor: string,
    date: string,
    content: string
}
export const historical_msg = writable<msg[]>([]);