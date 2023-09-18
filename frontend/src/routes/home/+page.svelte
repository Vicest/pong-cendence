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

    if (socket.disconnected) {
        socket.connect()
    }

//Chat
    socket.on('recvMsg', (message) => {
        const receivedMessagesDiv = document.getElementById('receivedMessages');
        const messageElement = document.createElement('p');
        messageElement.textContent = `From: ${message.sender}, Message: ${message.msg}`;
        receivedMessagesDiv.appendChild(messageElement);
        console.log("Devuelve un checkeo con -> "+ message.sender +" - " + message.msg )
        socket.emit('check_message',  { receptorUUID: message.sender, "msg":message.msg })
    })

    socket.on('checkMsg', (message) => {
        const receivedMessagesDiv = document.getElementById('receivedMessages');
        const messageElement = document.createElement('p');
        messageElement.textContent = `Yo to: ${message.sender}, Message: ${message.msg}`;
        receivedMessagesDiv.appendChild(messageElement);
    })
//Chat???
//    document.getElementById('sendButton').addEventListener('click', () => {
//        const receptorInput = document.getElementById('receptor');
//        const msgInput = document.getElementById('msg_text');
//
//        const receptor = receptorInput.value;
//        const msg = msgInput.value;
//        console.log("MENSAJE ESPECIAL DE "+ receptor +" :"+msg )
//        // Emit the 'mensaje' event with the collected data
//        socket.emit('mensaje', { receptorUUID: receptor, "msg":msg });
//    });

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
        <form id="messageForm">
          <label for="receptor">ID del Receptor:</label>
          <input type="text" id="receptor" name="receptor" required><br><br>

          <label for="msg">Mensaje:</label>
          <input type="text" id="msg_text" name="msg_text" required><br><br>

          <button class="duel-button" id="sendButton">Enviar Mensaje!</button>
          <!--          <button type="button" id="sendButton">Enviar Mensaje</button>-->
          </form>
      </div>
    </div>
    <div>
      <h1>Mensajes Recibidos</h1>
      <div id="receivedMessages"></div>
    </div>
</home>
