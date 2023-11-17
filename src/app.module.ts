import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisModule } from './redis/redis.module';
import { WebSocketServerModule } from './websocket-server/wesocket-server.module';
import { WebSocketClientModule } from './websocket-client/websocket-client.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: '127.0.0.1',
      port: 6379,
    }),
    RedisModule,
    WebSocketServerModule,
    WebSocketClientModule,
  ],
})
export class AppModule {}
