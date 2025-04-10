import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { Planos } from './_core/entity/planos.entity';
import { Agendas } from './_core/entity/agendas.entity';
import { Alunos } from './_core/entity/alunos.entity';
import { Modalidades } from './_core/entity/modalidades.entity';
import { Cobrancas } from './_core/entity/cobrancas.entity';
import { ClienteModulos } from './_core/entity/cliente-modulos.entity';
import { Precos } from './_core/entity/precos.entity';
import { Clientes } from './_core/entity/clientes.entity';
import { CobrancasCliente } from './_core/entity/cobrancas-cliente.entity';
import { CobrancasClienteItems } from './_core/entity/cobrancas-cliente-items.entity';
import { ModalidadesModule } from './modalidades/modalidades.module';
import { PlanosModule } from './planos/planos.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mariadb',
        host: config.get('DATABASE_HOST'),
        port: 3306,
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_SCHEMA'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([
      Planos,
      Agendas,
      Alunos,
      Modalidades,
      Cobrancas,
      ClienteModulos,
      Precos,
      Clientes,
      CobrancasCliente,
      CobrancasClienteItems,
    ]),
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
    ModalidadesModule,
    PlanosModule,
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
