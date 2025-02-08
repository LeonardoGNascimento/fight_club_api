import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = createClient({
      url: this.configService.get('REDIS_URL'),
    });

    this.client.on('error', (err) => console.error('Redis Error:', err));

    await this.client.connect();
    console.log('✅ Redis conectado com sucesso!');
  }

  async set(key: string, value: any, ttl?: number) {
    await this.client.set(key, JSON.stringify(value));
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }

  async get(key: string) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log('❌ Redis desconectado');
  }
}
