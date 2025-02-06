import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './auth.guard';

@Global()
@Module({
  providers: [PrismaService, JwtStrategy, JwtAuthGuard],
  exports: [PrismaService, JwtStrategy, JwtAuthGuard],
})
export class CoreModule {}
