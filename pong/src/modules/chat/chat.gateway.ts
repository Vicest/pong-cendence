import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	ConnectedSocket,
	MessageBody
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class ChatGateway{
	@WebSocketServer()
	private server: Server;


	@SubscribeMessage('mensaje')
	sendmsg(@ConnectedSocket() socket: Socket,
	@MessageBody() data: { receptorUUID: string, msg: string }): void {
		//Log de quien lo manda / a donde se manda y mensaje
		console.log("Msg de "+ socket.id + " para "+ data.receptorUUID+ " :"+data.msg);
		const challengerUUID:string = socket.handshake.auth.token;
		this.server.to(data.receptorUUID).emit('recvMsg', {"sender" : socket.handshake.auth.token, "msg" : data.msg});
	}

	@SubscribeMessage('check_message')
	checkmsg(@ConnectedSocket() socket: Socket,
	@MessageBody() data: { receptorUUID: string, msg: string }): void {
		//Log de quien lo manda / a donde se manda y mensaje
		console.log("Msg Check from "+ socket.id + " to " + data.receptorUUID);
		const challengerUUID:string = socket.handshake.auth.token;
		this.server.to(data.receptorUUID).emit('checkMsg', {"sender" : socket.handshake.auth.token, "msg" : data.msg});
	}


}
