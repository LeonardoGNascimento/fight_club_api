import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './_core/core.module';
import { AbacatePayModule } from './abacatePay/acabatePay.module';
import { AgendaModule } from './agenda/agenda.module';
import { AlunosModule } from './alunos/alunos.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ClienteModule } from './cliente/cliente.module';
import { CobrancaModule } from './cobrancas/cobranca.module';
import { GraduacaoModule } from './graduacao/graduacao.module';
import { PrecoModule } from './precos/precos.module';
import { TurmaModule } from './turmas/turma.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '137.184.182.255',
      port: 3306,
      username: 'admin',
      password: 'c3fbd71943f44829cd06',
      database: 'dojoplanner',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    ClienteModule,
    CobrancaModule,
    AlunosModule,
    AgendaModule,
    AbacatePayModule,
    PrecoModule,
    GraduacaoModule,
    TurmaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
