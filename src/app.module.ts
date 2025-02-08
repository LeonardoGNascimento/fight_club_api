import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './_core/core.module';
import { AcademiasModule } from './academias/academias.module';
import { AlunosModule } from './alunos/alunos.module';
import { CobrancaModule } from './cobrancas/cobranca.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgendaModule } from './agenda/agenda.module';
import { ClerkClientProvider } from './_core/clerkClient.provider';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from './_core/guard/clerk-auth.guard';
import { AbacatePayModule } from './abacatePay/acabatePay.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    CobrancaModule,
    AcademiasModule,
    AlunosModule,
    AgendaModule,
    AbacatePayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
