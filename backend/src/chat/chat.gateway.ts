import {WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UsersService } from '../users/users.service';

@WebSocketGateway({ cors: true })
export class ChatGateway{
	@WebSocketServer()
	private server: Server;
	constructor (private readonly userService : UsersService) {}

	afterInit(server: Server) {
		console.log('Socket initialized');
	}

	handleConnection(socket: Socket) {
		// this.logger.debug('Socket connected: login : '+ socket.handshake.auth.login + ' | sesion : ' + socket.id + ' is ' + socket.handshake.auth.token)
		console.log('Socket connected: login : '+ socket.handshake.auth.user + ' | sesion : ' + socket.id)
		socket.join(socket.handshake.auth.user)
	}

	handleDisconnect(socket: Socket) {
		// this.logger.debug('Socket disconnected: ' + socket.id + ' was ' + socket.handshake.auth.token)
		//TODO Handle ongoing game disconnection.
		console.log('Socket disconnected: ' + socket.id + ' was ' + socket.handshake.auth.token)
	}
	
    @SubscribeMessage('group_message')
	async send_groupmsg(@ConnectedSocket() socket: Socket,
	@MessageBody() data: any ):  Promise<void> {
		// console.log("Mensaje grupal de " + data.sender.nickname + " dice que "+ data.content);
		// console.log("Mensaje grupal reciben "+ data.receiver);
		let new_msg = await this.userService.createChatMessage(data).toPromise();
		data.receiver.members.forEach((receiver) => {
			console.log("Quien lo recibe ? "+ receiver.nickname);
			this.server.to(receiver.nickname).emit('group_message', new_msg);
		});
		return;
	}

	@SubscribeMessage('priv_message')
	async send_privmsg(@ConnectedSocket() socket: Socket,
	@MessageBody() data: any): Promise<void> {
		// console.log("Mensaje privado de " + data.sender.nickname + " dice que "+ data.content);
		const new_msg = await this.userService.createUserMessage(data).toPromise();
		// console.log("Datos del privado de " + new_msg.sender.nickname + " dice que "+ new_msg.content);
		this.server.to(data.receiver.nickname).emit('priv_message', new_msg);
		if (data.sender.nickname != data.receiver.nickname) {
			this.server.to(data.sender.nickname).emit('priv_message', new_msg);
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