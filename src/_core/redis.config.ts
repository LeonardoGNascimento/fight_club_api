import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService) {
    // this.logger = new Logger(RedisService.name);
  }

  async onModuleInit(): Promise<void> {
    // this.client = createClient({
    //   url: this.configService.get('REDIS_URL'),
    // });

    // await this.client.connect();
    // this.logger.log('Redis conectado com sucesso!');
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }

  async get<T>(key: string): Promise<T> {
    const value: string = await this.client.get(key);
    return (value ? JSON.parse(value) : null) as T;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
    this.logger.log('❌ Redis desconectado');
  }
}
