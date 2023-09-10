<script lang="ts">
    import { isAuth } from "../../services/isAuth";
    isAuth();
    import io from "socket.io-client";
    // import { io as socket } from 'socket.io-client';

    // const socket = io();
    // const canvas = document.querySelector("canvas") as HTMLCanvasElement;

    let opponent;

    function duel() {
        opponent = prompt("Duel whom?")
        socket.emit('challenge', opponent)
    }

    function resetCanvas() {
        // const canvas = document.getElementById("match")
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    let myToken ="";
    function draw(match) {
        // const canvas = document.getElementById("match")
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")
        document.getElementById("test").innerHTML="Width: "+canvas.width+"|Height: "+canvas.height

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#117711"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#FF1111" //PADDLES
        ctx.fillRect(0, match.paddlePosition[0] * 50,
            1 * 50, 4 * 50)
        ctx.fillRect(600, match.paddlePosition[1] * 50,
            1 * 50, 4 * 50)
        ctx.fillStyle = "#1111FF" //BALL
        ctx.fillRect((match.ball[0]+1) * 50, (match.ball[1]) * 50,
            1 * 50, 1 * 50)
    }

        let myID =(Math.random() + 1).toString(36).substring(7)

        var socket = io('http://localhost:5000',{
            autoConnect: false,
            auth: {
                token: myID
            }
        },)

    if (socket.disconnected) {
        socket.connect()
        // document.getElementById("myToken").innerHTML=myID
        myToken = myID;
        function eventListenerWrapper(mySocket) {
            document.addEventListener('keydown', (event) => {
                keyboardInput(event, mySocket)
            })
        }
        eventListenerWrapper(socket)
    }

//Auto-accept / Events
    socket.on('beChallenged', (challenger) => {
        socket.emit('challengeResponse', { accept:true, opponent:challenger })
    })

    var matchString = ""
    socket.on('roomId', (room) => {
        matchString = room;
        // document.getElementById("room").innerHTML=matchString
    })

    let score ="";
    socket.on('gameUpdate', (matchStatus) => {
        draw(matchStatus);
        score = matchStatus.score[0]+'-'+matchStatus.score[1];
        // document.getElementById("score").innerHTML=matchStatus.score[0]+'-'+matchStatus.score[1]
    })

    socket.on('win', () => {
        // document.getElementById("score").innerHTML='You WIN!'
        score = 'You WIN!';
        resetCanvas();
    })

    socket.on('lose', () => {
        score = 'You LOSE!';
        // document.getElementById("score").innerHTML='You LOSE!'
        resetCanvas();
    })

    //INPUT
    function keyboardInput(event, emitter) {
        var userInput = { player:myID, match:matchString ,actions:-1 }
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
    @import 'home.css';
    .duel-button{
        width: 120px;
        height: 120px;
        font-size: 300;
        background-color: yellow;
        border: 4px solid black;
        color: purple;
        border-radius: 30px;

    }

  
</style>

<home>
    <!-- <h1 style="font-size: 80px;">GAME</h1> -->
    <button class="duel-button" on:click={duel}>Duel!</button>
	<p></p>
	<button id="myToken" type="button">{myToken}</button>
	<p>ROOM</p>
	<p id="room">{matchString}</p>
	<p>TEST</p>
	<p id="test"></p>
	<p>SCORE</p>
	<p id="score">{score}</p>
	<!-- (10 + 3) * 50 -->
	<canvas id="match" height=550 width=650></canvas>
    
</home>
