<script lang="ts">
    import { isAuth } from "../../services/isAuth"
    isAuth();
    import { io } from "socket.io-client"

    let myToken = (Math.random() + 1).toString(36).substring(7)
    let socket = io('http://localhost:5000',{
        autoConnect: false,
        auth: {
            token: myToken
        }
    },)
    let receivedMessage = '';

    if (socket.disconnected) {
        socket.connect()
    }

//Chat
    socket.on('recvMsg', (message) => {
        console.log("MSG RECIBIDO!!!")
        receivedMessage = message.msg;
    })

//Auto-accept / Events
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
      
    });
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
</style>

<home>
    <div>
      <h1>Mensajes Recibidos</h1>
      <div id="receivedMessages">
        {#if receivedMessage}
            <p>{receivedMessage}</p>
        {/if}
      </div> 
    </div>
</home>
