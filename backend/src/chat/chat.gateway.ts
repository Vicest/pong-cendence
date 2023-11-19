import {WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UserDto } from 'src/users/dto/users.dto';
import { messagesChannelDto } from './dto/message/channel.dto';
import { messagesUserDto } from './dto/message/user.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway{
	@WebSocketServer()
	private server: Server;

	afterInit(server: Server) {
		console.log('Socket initialized');
	}

	handleConnection(socket: Socket) {
		// this.logger.debug('Socket connected: login : '+ socket.handshake.auth.login + ' | sesion : ' + socket.id + ' is ' + socket.handshake.auth.token)
		console.log('Socket connected: login : '+ socket.handshake.auth.user + ' | sesion : ' + socket.id)
		socket.join(socket.handshake.auth.login)
	}

	handleDisconnect(socket: Socket) {
		// this.logger.debug('Socket disconnected: ' + socket.id + ' was ' + socket.handshake.auth.token)
		//TODO Handle ongoing game disconnection.
		console.log('Socket disconnected: ' + socket.id + ' was ' + socket.handshake.auth.token)
	}
	
    @SubscribeMessage('message')
	sendmsg(@ConnectedSocket() socket: Socket,
	@MessageBody() data: messagesChannelDto | messagesUserDto): void {
		console.log("Mensaje recibido: " + data.content);
		if (data instanceof messagesChannelDto) {
			// Acciones específicas para messagesChannelDto
			console.log("Mensaje de canal recibido:", data);
		} else if (data instanceof messagesUserDto) {
			// Acciones específicas para messagesUserDto
			console.log("Mensaje de usuario recibido:", data);
		}else{
			console.log("Mensaje de tipo desconocido recibido:", data);
		}
		
		return;
	}
	

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