import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modalidades } from 'src/_core/entity/modalidades.entity';
import { AlunosModule } from 'src/alunos/alunos.module';
import { AlunosGraducaoHistorico } from '../_core/entity/alunos-graducao-historico.entity';
import { Alunos } from '../_core/entity/alunos.entity';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';
import { Cobrancas } from '../_core/entity/cobrancas.entity';
import { ExamesGraducaoAlunos } from '../_core/entity/exames-graducao-alunos.entity';
import { Graduacoes } from '../_core/entity/graduacoes.entity';
import { Planos } from '../_core/entity/planos.entity';
import { ModalidadesController } from './modalidades.controller';
import { ModalidadesService } from './modalidades.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Alunos,
      CobrancasClienteItems,
      AlunosGraducaoHistorico,
      Graduacoes,
      Planos,
      ExamesGraducaoAlunos,
      Cobrancas,
      Modalidades,
    ]),
    AlunosModule,
  ],
  controllers: [ModalidadesController],
  providers: [ModalidadesService],
})
export class ModalidadesModule {}
