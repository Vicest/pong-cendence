import { io } from "socket.io-client";
import { writable } from "svelte/store";

export const aux_socket = writable();

