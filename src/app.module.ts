import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './_core/core.module';
import { AlunosModule } from './alunos/alunos.module';
import { CobrancaModule } from './cobrancas/cobranca.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgendaModule } from './agenda/agenda.module';
import { ClerkClientProvider } from './_core/clerkClient.provider';
import { AbacatePayModule } from './abacatePay/acabatePay.module';
import { PrecoModule } from './precos/precos.module';
import { GraduacaoModule } from './graduacao/graduacao.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Academias } from './_core/entity/academias.entity';
import { Admin } from './_core/entity/admin.entity';
import { Precos } from './_core/entity/precos.entity';
import { Agendas } from './_core/entity/agendas.entity';
import { Alunos } from './_core/entity/alunos.entity';
import { AlunosExamesGraducao } from './_core/entity/alunos-exames-graducao.entity';
import { AlunosGraducao } from './_core/entity/alunos-graducao.entity';
import { Chamada } from './_core/entity/chamada.entity';
import { ClienteModulos } from './_core/entity/cliente-modulos.entity';
import { Clientes } from './_core/entity/clientes.entity';
import { Cobrancas } from './_core/entity/cobrancas.entity';
import { CobrancasCliente } from './_core/entity/cobrancas-cliente.entity';
import { CobrancasClienteItems } from './_core/entity/cobrancas-cliente-items.entity';
import { ExamesGraduacao } from './_core/entity/exames-graduacao.entity';
import { Graduacoes } from './_core/entity/graduacoes.entity';
import { Modalidades } from './_core/entity/modalidades.entity';
import { Planos } from './_core/entity/planos.entity';
import { Professores } from './_core/entity/professores.entity';
import { Turmas } from './_core/entity/turmas.entity';
import { Usuarios } from './_core/entity/usuarios.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './_core/guard/jwt-auth.guard';
import { ClienteModule } from './cliente/cliente.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '137.184.182.255',
      port: 3306,
      username: 'admin',
      password: 'c3fbd71943f44829cd06',
      database: 'dojoplanner',
      entities: [
        Academias,
        Admin,
        Precos,
        Agendas,
        Alunos,
        AlunosExamesGraducao,
        AlunosGraducao,
        Chamada,
        ClienteModulos,
        Clientes,
        Cobrancas,
        CobrancasCliente,
        CobrancasClienteItems,
        ExamesGraduacao,
        Graduacoes,
        Modalidades,
        Planos,
        Professores,
        Turmas,
        Usuarios
      ],
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
}
