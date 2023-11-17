import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketClientService } from '../websocket-client/websocket-client.service';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGatewayServer
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private rooms: { [key: string]: number } = {};

  constructor(private readonly wsClientService: WebsocketClientService) {}

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    client.emit('message', 'Hello from server!');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    client.emit('message', 'Hello from server!');
  }

  @SubscribeMessage('single-subscribe')
  handleSingleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Received data from client:', data);

    this.wsClientService
      .singleSubscribe(client, data?.symbols.join())
      .subscribe(({ clientI, message }) => {
        clientI.emit('message', message);
      });
  }

  @SubscribeMessage('single-unsubscribe')
  handleSingleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Received data from client:', data);

    this.wsClientService.unsubscribe(client, data?.symbols.join());
    client.emit('message', 'Unsubscribe: ' + data);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Received data from client:', data);

    this.joinRoom(client, data?.symbols);
  }

  @SubscribeMessage('unsubscribe')
  handleUnSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Received data from client:', data);

    this.leaveRoom(client, data?.symbols);
  }

  @OnEvent('rooms-message')
  handleRoomsMessage(data: { room: string; msg: string }) {
    // console.log(this.server.sockets.adapter.rooms);
    this.server.to(data.room).emit('message', data.msg);
  }

  private joinRoom(client: Socket, symbols: string[]) {
    symbols.forEach((room) => {
      if (!this.rooms[room]) {
        this.wsClientService.subscribe(client, room);
        Object.assign(this.rooms, { [room]: 1 });
      } else {
        this.rooms[room] += 1;
      }
      client.join(room);
    });
    console.log('rooms join: ', this.rooms);
  }

  private leaveRoom(client: Socket, symbols: string[]) {
    symbols.forEach((room) => {
      if (this.rooms[room] === 1) {
        this.wsClientService.unsubscribe(client, room);
      }
      this.rooms[room] -= 1;
      client.leave(room);
      console.log('rooms leave: ', this.rooms);
    });
  }
}
