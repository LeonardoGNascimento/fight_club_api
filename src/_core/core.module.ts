import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [ConfigModule, AuthModule],
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class CoreModule {}
