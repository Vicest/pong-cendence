<script lang="ts">
    import { isAuth } from "../../services/isAuth"
    isAuth();
    import { io } from "socket.io-client"

     enum States {
      unfocused,
      queueing,
      spectating,
      playing,
    };


    let websocks = "Nada"
    //FIXME I should handle requests better.
    let matches = [];///*:{name:string,score:string}[]*/ = getLiveMatches()
    //FIXME Hardcoded remote route
    
    //async function getLiveMatches() {
      //await
    setInterval(() => {
      fetch('http://localhost:5000/games/match_list', {
        method:"GET"
      }).then((response:Response) => {
        if (!response.ok)
          throw new Error("Could not update match list")
        return response.json()
      }).then((response_json) => {
        matches=response_json
        console.log(response_json)
      }).catch((error) => {
        console.log(error)
      })
    },
    5000)
    //ENDFIXME
    

    //TODO Should I keep utility funtions in a separate file to avoid cluttering the logic?
    //TODO 2, Mybe change prompt for input, way cleaner, dunno if worth the change for debug purposes
    function queueUp():void {
      status = States.queueing
      return //TODO Call backend
    }

    function duel():void {
        let opponent:string = prompt("Duel whom?")
        socket.emit('challenge', opponent)
    }

    function watchByPlayer():void {
      let player:string = prompt("Player id to spectate:")
      status = States.spectating
      socket.emit('watch', {targetType:'user', targetString:player})
    }
    function watchByMatch():void {
      let match:string = prompt("Match id to spectate:")
      status = States.spectating
      socket.emit('watch', {targetType:'match', targetString:match})
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

    //Auto-accept / Events
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on('beChallenged', (challenger:string) => {
      websocks = "Challlenged"
        socket.emit('challengeResponse', { accept:true, opponent:challenger })
    })

    //TODO name is game start
    socket.on('roomId', (room:string) => {websocks = "playing"
        status = States.playing
        matchString = room;
        document.addEventListener('keydown', (event) => {
                keyboardInput(event, socket)
            })
    })

    socket.on('gameUpdate', (matchStatus) => {
      websocks = "me llega la update"
        draw(matchStatus)
        score = matchStatus.score[0]+'-'+matchStatus.score[1]
    })

    socket.on('win', () => {
        score = 'You WIN!'
      websocks = score
        resetCanvas()
        status = States.unfocused
    })

    socket.on('lose', () => {
      websocks = score
        score = 'You LOSE!'
      websocks = score
        resetCanvas();
        status = States.unfocused
    })

    //INPUT
    function keyboardInput(event, emitter) {
        var userInput = { player:myToken, match:matchString, actions:-1 }
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

  /*TODO proper cards for matches*/
  .watch-card {
      width: 120px;
      height: 40px;
      font-size: 150;
      background-color: yellow;
      border: 1px solid black;
      color: purple;
      border-radius: 10px;
  }

  .container {
      overflow: auto; /* Clearfix */
  }
</style>

<arena>
    <div>{myToken}<br>{matchString}<br>CHIVATO:  {websocks}</div>
    <div class="container" title="Live Games">
      {#each matches as match}
        <button class="watch-card">{match.room}-{match.score}</button>
      {:else}
        <div>No games running right now!</div>
      {/each}
    </div>
    <div>
      {#if status === States.unfocused}
        <button class="duel-button" on:click={duel}>Duel!</button>
        <button class="duel-button" on:click={queueUp}>Play</button>
        <button class="duel-button" on:click={watchByPlayer}>Watch player</button>
        <button class="duel-button" on:click={watchByMatch}>Watch game</button>
      {:else if status === States.playing}
        <div>
          <!-- (10 + 3) * 50 -->
          <canvas id="match" height=550 width=650></canvas>
        </div>
      {:else if status === States.queueing}
        <p>In queue for XX:XX.</p>
      {:else if status === States.spectating}
        <p>This is pretty much spectating but without playing!!</p><br>
        <!-- (10 + 3) * 50 -->
        <canvas id="match" height=550 width=650></canvas>
      {/if}
    </div>
</arena>
