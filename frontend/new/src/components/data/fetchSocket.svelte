<script lang="ts" context="module">
    import { io } from "socket.io-client";
    import { apiurl} from "../../store/ApiURL";
    import { aux_socket } from "../../store/Socket";
	import { user } from "../../store/User";

    let url = "";
    let aux_user : any;

    apiurl.subscribe((value) => {
        url = value;
        console.log("URL changed -> ", value)
    });

    user.subscribe((value) => {
        aux_user = value;
        console.log("URL changed -> ", value)
    });

    export async function fetchSocket() {
        return new Promise((resolve) => {
            // console.log("Socket fetch -> ", aux_user)
            let new_socket = io(url,{
                    autoConnect: false,
                    transports: ['websocket'],
                    auth: {
                        user : aux_user.nickname
                    },
                })

            if (new_socket.disconnected) {
                new_socket.connect()
            }

            new_socket.on("connect_error", (err : any) => {
                console.log(`connect_error due to ${err.message}`);
            });
            
            aux_socket.set(new_socket);
            console.log("Socket seteado")
            resolve();
        });
    };

</script>