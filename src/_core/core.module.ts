import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.config';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ClerkStrategy } from './guard/clerk.strategy';
import { ClerkClientProvider } from './clerkClient.provider';

@Global()
@Module({
  imports: [PassportModule, ConfigModule],
  providers: [PrismaService, ClerkStrategy, ClerkClientProvider, RedisService],
  exports: [PrismaService, ClerkStrategy, ClerkClientProvider, RedisService],
})
export class CoreModule {}
