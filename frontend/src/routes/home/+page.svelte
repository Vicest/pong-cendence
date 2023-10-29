<script lang="ts">
    import { isAuth } from "../../services/isAuth";
    import { io } from "socket.io-client";
    import { apiData } from '../../services/my42data';
    import { onMount } from 'svelte';
    import { historical_msg } from "../../store";
    isAuth();

    let myToken = (Math.random() + 1).toString(36).substring(7)
    let receivedMessage = '';
    let apidata;

    async function fetchData() {
    return new Promise((resolve) => {
        apiData.subscribe((data) => {
        apidata = data;
        console.log(data.login);
        resolve();
        });
    });
    }

    onMount(async () => {
    await fetchData();
    // El resto de tu lógica aquí después de que los datos se establezcan.


        console.log("Persona logeada -> " + apidata.login)

        let socket = io(`http://localhost:5000`,{
                autoConnect: false,
                transports: ['websocket'],
                auth: {
                    token: apidata.login,
                    login : apidata.login
                },
            }
            )
            console.log("2 -> " + apidata.login)
        if (socket.disconnected) {
            socket.connect()
        }

        socket.on('recvMsg', (message) => {
            console.log("MSG RECIBIDO!!!")
            receivedMessage = message.msg;
            console.log("Yo soy ... " + apidata.login)
        })

        socket.on('recv_historial_response', (res) => {
			console.log("Historial obtenido", res);
            historical_msg.set(res.msg)
			// Puedes procesar la respuesta del servidor aquí
		}).on('error', (err) => {
			console.log("Error ? -> " + err);
		});


    });

//Auto-accept / Events
    
</script>


<style>
    @import 'home.css';
    .duel-button {
        width: 120px;
        height: 120px;
        font-size: 300;
        background-color: yellow;
        border: 4px solid black;
        color: purple;
        border-radius: 30px;
    }

    .container {
        overflow: auto; /* Clearfix */
    }

    .float-right {
        float: right;
        width: 50%; /* Ajusta el ancho según sea necesario */
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
    }

    .received-messages {
        overflow: auto; /* Clearfix */
        padding: 10px;
        width: 50%; /* Ajusta el ancho según sea necesario */
        box-sizing: border-box;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
    }
</style>

<home>
    <div class="container">
      <div class="float-right">
        
          <!--        Contenido principal   -->
      </div>
    </div>
    <div>
        <h1>Mensajes Recibidos</h1>
        <div id="receivedMessages">
            {#if receivedMessage}
                <p>{receivedMessage}</p>
            {/if}
        </div>
    </div>
</home>
