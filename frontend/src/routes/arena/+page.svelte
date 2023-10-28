<script lang="ts">
    //import { Card } from 'sveltestrap'

    import { isAuth } from "../../services/isAuth"
    isAuth();
    import { io, Socket } from "socket.io-client"

     enum States {
      unfocused,
      queueing,
      spectating,
      playing,
    };

    //TODO Is this is a component?, place it right, I guess
    //Component card
    //Store the matches.

    //FIXME I should handle requests better.
    let matches:any = [];///*:{name:string,score:string}[]*/ = getLiveMatches()
    //FIXME Hardcoded remote route
     
    //async function getLiveMatches() {
      //await
    setInterval(async () => {
      try {
      matches = await (await fetch('http://localhost:5000/games/match_list')).json()
      } catch {
        (e) => {
          console.log("Hola")
          console.log(e)
        }
      }
    }, 5000)
    //ENDFIXME

    function duel():void {
        let opponent:string = prompt("Duel whom?")
        socket.emit('challenge', opponent)
    }

    let currentMatch:string = '';
    //TODO WbP is not meant to exist.
    function watchByPlayer():void {
      let player:string = prompt("Player id to spectate:")
      stopWatching(currentMatch)
      status = States.spectating
      socket.emit('watch', {targetType:'user', targetString:player})
    }

    function watchByMatch(matchString:string):void {
      stopWatching(currentMatch)
      currentMatch = matchString
      status = States.spectating //TODO Check if the watch actually happened
      socket.emit('watch', {targetType:'match', targetString:matchString})
    }

    function stopWatching(matchString:string):void {
      status = States.unfocused
      socket.emit('stopWatching', matchString)
    }
    //END FUNCS

    //Match logic
    function resetCanvas() {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    function draw(match) {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#117711"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#FF1111" //PADDLES
        ctx.fillRect(0, match.paddlePosition[0] * 50,
            1 * 50, match.paddleSize[0] * 50)
        ctx.fillRect(600, match.paddlePosition[1] * 50,
            1 * 50, match.paddleSize[1] * 50)
        ctx.fillStyle = "#1111FF" //BALL
        ctx.fillRect((match.ball[0]+1) * 50, (match.ball[1]) * 50,
            1 * 50, 1 * 50)
    }

let matchString:string = ''
let score:string =  ''
let status:States = States.unfocused
//FIXME Some debug temporary variables
let myToken:string = (Math.random() + 1).toString(36).substring(7)
let login:string = ["vicmarti", "josuna-t", "aborboll", "mortiz-d", "msantos-"][Math.floor(Math.random()*5)]
let socket:Socket = io('http://localhost:5000',{
  autoConnect: true,
  transports: ['websocket'],
  auth: {
      token: myToken,
      login: login
  }
})

if (socket.disconnected) {
  socket.connect()
}

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

//Auto-accept / Events
socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
socket.on('beChallenged', (challenger:string) => {
    socket.emit('challengeResponse', { accept:true, opponent:challenger })
})
//TODO name is game start
//INPUT
function keyboardInput(event, emitter) {
        var userInput = { match:matchString, actions:-1 }
        switch (event.key) {
            case 'x':
                userInput.actions = 0;
                break;
            case 'z':
                userInput.actions = 1;
                break;
            default: return;
        }
        emitter.emit('playerMoves', userInput) //TODO
    }
socket.on('roomId', (room:string) => {
    status = States.playing
    matchString = room;
    document.addEventListener('keydown', (event) => {
            keyboardInput(event, socket)
        })
})
socket.on('gameUpdate', (matchStatus) => {
    draw(matchStatus)
    score = matchStatus.score[0]+'-'+matchStatus.score[1]
})
socket.on('win', () => {
    score = 'You WIN!'
    resetCanvas()
    status = States.unfocused
})
socket.on('lose', () => {
    score = 'You LOSE!'
    resetCanvas();
    status = States.unfocused
})
    /*
setInterval(() => {
  console.log("Sent ping: ", Date.now())
  socket.emit('ping')
  }, 200)
  */
    

    //TODO Should I keep utility funtions in a separate file to avoid cluttering the logic?
    //TODO 2, Mybe change prompt for input, way cleaner, dunno if worth the change for debug purposes
    async function queueUp() {
      console.log("Emiting queue: ", login)
      socket.emit("queue", login, () => {
        console.log("Recieved: ", login);
      })
      status = States.queueing
      /*TODO
      console.log("a: ", myToken, "b: ", myRating, "JSONed: ", JSON.stringify({user:myToken, rating:myRating}))
      await fetch('http://localhost:5000/queue',
      {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user:myToken, rating:myRating})
      })
      status = States.queueing
      return //TODO Call backend\
      */
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

  /*TPM*/
  input {
      background-color: #7e0808;
  }

  /*TODO proper cards for matches*/
  .watch-card {
      width: 120px;
      height: 180px;
      font-size: 150;
      background-color: rgba(255, 255, 0, 0.6);
      border: 1px solid black;
      color: purple;
      border-radius: 10px;
  }

  .container {
      overflow: auto; /* Clearfix */
  }
</style>

<arena>
    <div>{myToken}<br>{matchString}</div>
    <input disabled type="text" bind:value={login}>
    <br>
    <div class="container" title="Live Games">
      {#each matches as match}
        <button class="watch-card" on:click={() => watchByMatch(match.room)}>
          {match.room}<br>vs<br>{match.room}<br><br>{match.score}</button>
          <!--
      {#each matches as [matchKey, match] (matchKey)}
        <button class="watch-card" on:click={() => watchByMatch(matchKey)}>
          {match.players[0].id_}<br>vs<br>{match.players[1].id_}<br><br>{match.score}</button> 
          -->
      {:else}
        <div>No games running right now!</div>
      {/each}
    </div>
    <!--Refactor the logic behind this-->
    <div>
      {#if status === States.unfocused}
        <button class="duel-button" on:click={duel}>Duel!</button>
        <button class="duel-button" on:click={queueUp}>Play</button>
        <button class="duel-button" on:click={watchByPlayer}>Watch player</button>
      {:else if status === States.playing || status === States.spectating}
        <!-- (10 + 3) * 50 -->
        <canvas id="match" height=550 width=650></canvas>
      {:else if status === States.queueing}
        <p>In queue for XX:XX.</p>
        <p>TODO: Should we place an animation or something here? A timer?</p>
      {/if}
    </div>
</arena>
