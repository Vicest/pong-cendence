import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketConfig extends IoAdapter {
  // Puedes añadir opciones para configurar tu servidor de sockets aquí
  // Por ejemplo, configuración de CORS, configuración de origen, etc.
  constructor() {
    super(/* Aquí puedes pasar opciones de configuración de Socket.IO */);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    // Aquí puedes añadir lógica adicional si es necesario al crear el servidor de sockets
    // Por ejemplo, manejo de eventos globales, autenticación de sockets, etc.

    return server;
  }
}