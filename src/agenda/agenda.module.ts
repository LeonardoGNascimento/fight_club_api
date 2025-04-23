import { Module } from '@nestjs/common';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendas } from '../_core/entity/agendas.entity';
import { Alunos } from '../_core/entity/alunos.entity';
import { Cobrancas } from '../_core/entity/cobrancas.entity';
import { Clientes } from '../_core/entity/clientes.entity';
import { CobrancasCliente } from '../_core/entity/cobrancas-cliente.entity';
import { Precos } from '../_core/entity/precos.entity';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';
import { ClienteModulos } from '../_core/entity/cliente-modulos.entity';
import { Modalidades } from '../_core/entity/modalidades.entity';
import { Planos } from '../_core/entity/planos.entity';
import { AlunosGraducaoHistorico } from '../_core/entity/alunos-graducao-historico.entity';
import { Chamada } from 'src/_core/entity/chamada.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agendas,
      AlunosGraducaoHistorico,
      Alunos,
      Cobrancas,
      Clientes,
      CobrancasCliente,
      Precos,
      CobrancasClienteItems,
      ClienteModulos,
      Modalidades,
      Planos,
      Chamada,
    ]),
  ],
  controllers: [AgendaController],
  providers: [AgendaService],
})
export class AgendaModule {}
