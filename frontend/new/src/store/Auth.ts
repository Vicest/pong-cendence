import { writable } from 'svelte/store'

export const currentUser = writable<{
    id: string
    nickname: string,
    avatar: string,
} | null>()