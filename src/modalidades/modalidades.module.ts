import { Module } from '@nestjs/common';
import { ModalidadesService } from './modalidades.service';
import { ModalidadesController } from './modalidades.controller';
import { CobrancaModule } from 'src/cobrancas/cobranca.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alunos } from '../_core/entity/alunos.entity';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';
import { AlunosGraducao } from '../_core/entity/alunos-graducao.entity';
import { Graduacoes } from '../_core/entity/graduacoes.entity';
import { Planos } from '../_core/entity/planos.entity';
import { AlunosExamesGraducao } from '../_core/entity/alunos-exames-graducao.entity';
import { Cobrancas } from '../_core/entity/cobrancas.entity';
import { Modalidades } from 'src/_core/entity/modalidades.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Alunos,
      CobrancasClienteItems,
      AlunosGraducao,
      Graduacoes,
      Planos,
      AlunosExamesGraducao,
      Cobrancas,
      Modalidades,
    ]),
    CobrancaModule,
  ],
  controllers: [ModalidadesController],
  providers: [ModalidadesService],
})
export class ModalidadesModule {}
