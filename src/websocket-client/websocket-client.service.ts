import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import * as WebSocket from 'ws';

@Injectable()
export class WebsocketClientService {
  // wss://echo.websocket.org is a test websocket server
  private ws = new WebSocket(
    `wss://ws.eodhistoricaldata.com/ws/crypto?api_token=${process.env.EODHD_TOKEN}`,
  );

  constructor(private eventEmitter: EventEmitter2) {
    this.ws.on('open', () => {
      console.log('open');
    });
  }

  singleSubscribe(
    client: Socket,
    symbols: string,
  ): Observable<{ clientI: Socket; message: string }> {
    console.log('tyt');
    this.ws.send(JSON.stringify({ action: 'subscribe', symbols }));

    return new Observable((observer) => {
      this.ws.on('message', (message) => {
        const msg = Buffer.from(message as Buffer).toString();
        console.log('msg:', msg);
        observer.next({ clientI: client, message: msg });
      });
    });
  }

  subscribe(client: Socket, symbols: string) {
    console.log('tyt');
    this.ws.send(JSON.stringify({ action: 'subscribe', symbols }));

    this.ws.on('message', (message) => {
      const msg: any = Buffer.from(message as Buffer).toString();
      this.eventEmitter.emit('rooms-message', {
        room: JSON.parse(msg)['s'],
        msg,
      });
    });
  }

  unsubscribe(client: Socket, symbols: string) {
    this.ws.send(JSON.stringify({ action: 'unsubscribe', symbols }));
  }

  send(data: any) {
    this.ws.send(data);
  }

  //handler : Function
  onMessage(handler: any) {
    // ...
  }

  // ...
}
