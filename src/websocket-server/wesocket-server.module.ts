import { Module } from '@nestjs/common';
import { WebsocketGatewayServer } from './websocket.gateway';
import { WebSocketClientModule } from '../websocket-client/websocket-client.module';

@Module({
  imports: [WebSocketClientModule],
  providers: [WebsocketGatewayServer],
  exports: [WebsocketGatewayServer],
})
export class WebSocketServerModule {}
