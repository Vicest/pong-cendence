<script lang="ts">
    import { isAuth } from "../../services/isAuth"
    isAuth();
    import { io } from "socket.io-client"

    let playing:boolean = false
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

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    function queueUp():void {
      playing = true
      return //TODO Call backend
    }
</script>


<style>
  @import 'arena.css';
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
</style>

<arena>
    <div class="container">
      <p>Hi</p>
      {#if !playing}
        <button class="duel-button" on:click={queueUp}>Play</button>
      {:else}
        <p>Game is happening!!</p>
      {/if}
    </div>
</arena>
