import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.config';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ClerkStrategy } from './guard/clerk.strategy';
import { ClerkClientProvider } from './clerkClient.provider';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guard/jwt.stategy';

@Global()
@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [
    PrismaService,
    ClerkStrategy,
    ClerkClientProvider,
    RedisService,
    JwtStrategy,
  ],
  exports: [
    PrismaService,
    ClerkStrategy,
    ClerkClientProvider,
    RedisService,
    JwtModule,
  ],
})
export class CoreModule {}
