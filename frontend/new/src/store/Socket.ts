import { io } from "socket.io-client";

export const aux_socket = io("http://localhost:3000",{
    autoConnect: false,
    transports: ['websocket'],
    auth: {
        token: "ejemplo",
        login : "ejemploso"
    },
})