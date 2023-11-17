import { Module } from '@nestjs/common';
import { WebsocketClientService } from './websocket-client.service';

@Module({
  providers: [WebsocketClientService],
  exports: [WebsocketClientService],
})
export class WebSocketClientModule {}
