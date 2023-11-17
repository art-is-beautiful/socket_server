import { Injectable } from '@nestjs/common';
import Client from 'ioredis';

@Injectable()
export class RedisService {
  private redis = new Client({ host: '127.0.0.1', port: process.env.REDIS_PORT, password: process.env.REDIS_PASSWORD });

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    ttl = ttl ?? -1;
    await this.redis.set(key, value);
    await this.redis.expire(key, ttl);
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}
