import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [ConfigModule, AuthModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class CoreModule {}
