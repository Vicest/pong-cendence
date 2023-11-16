import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	ConnectedSocket,
	MessageBody
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { messagesChannelDto } from './dto/message/channel.dto';
import { messagesUserDto } from './dto/message/user.dto';
@WebSocketGateway(3001, { cors: true })
export class ChatGateway{
	@WebSocketServer()
	private server: Server;

	handleConnection(socket: Socket) {
		// this.logger.debug('Socket connected: login : '+ socket.handshake.auth.login + ' | sesion : ' + socket.id + ' is ' + socket.handshake.auth.token)
		socket.join(socket.handshake.auth.login)
		console.log("Socket connected: login : "+ socket.handshake.auth.login + " | sesion : " + socket.id + " is " + socket.handshake.auth.token);
	}

	handleDisconnect(socket: Socket) {
		// this.logger.debug('Socket disconnected: ' + socket.id + ' was ' + socket.handshake.auth.token)
		//TODO Handle ongoing game disconnection.
	}
	

	@SubscribeMessage('message')
	sendmsg(@ConnectedSocket() socket: Socket,
	@MessageBody() data: string): void {
		console.log("Ha llegado un mensaje -> " + data);
		return;	
	};
	

}
// @SubscribeMessage('mensaje')
	// sendmsg(@ConnectedSocket() socket: Socket,
	// @MessageBody() data: { receptorUUID: string,  emisorUUID: string,  date : string , msg: string }): void {
	// 	//Log de quien lo manda / a donde se manda y mensaje
	// 	console.log(""+ data.emisorUUID +" -> "+ data.receptorUUID + "| MSG -> :"+data.msg);
	// 	const newMessage: msg_obj = {
	// 		sender: data.emisorUUID,
	// 		receptor: data.receptorUUID,
	// 		date: data.date,
	// 		content: data.msg
	// 	};

	// 	if (this.msg_array) {
	// 		this.msg_array.push(newMessage);
	// 	} else {
	// 		this.msg_array = [newMessage]; // Inicializa el array si es nulo o undefined
	// 	}

	// 	// this.msg_array.forEach(message => {
	// 	// 	console.log('Sender:', message.sender);
	// 	// 	console.log('Receptor:', message.receptor);
	// 	// 	console.log('Date:', message.date);
	// 	// 	console.log('Content:', message.content);
	// 	// 	console.log('---'); // Separador entre mensajes
	// 	// });

	// 	this.server.to(data.receptorUUID).emit('recvMsg', {"sender" : socket.handshake.auth.token, "msg" : data.msg});

	// }

	// @SubscribeMessage('recv_historial')
	// recvmsg(@ConnectedSocket() socket: Socket,
	// @MessageBody() data: { receptor: string, emisor: string }): void {
	// 	console.log("Historial Request");
	// 	let mensajesFiltrados;
	// 	if (this.msg_array)
	// 		mensajesFiltrados = this.msg_array.filter((mensaje) => {
	// 			return mensaje.sender === data.emisor && mensaje.receptor === data.receptor;
	// 	  	});
	// 	else
	// 		mensajesFiltrados = undefined;
	// 	console.log("Historial Request -> " + mensajesFiltrados);
	// 	this.server.to(data.emisor).emit('recv_historial_response', {"obj" : mensajesFiltrados});
	// }