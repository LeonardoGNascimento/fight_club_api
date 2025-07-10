import { Module } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alunos } from '../_core/entity/alunos.entity';
import { AlunosGraducaoHistorico } from '../_core/entity/alunos-graducao-historico.entity';
import { Graduacoes } from '../_core/entity/graduacoes.entity';
import { Planos } from '../_core/entity/planos.entity';
import { ExamesGraducaoAlunos } from '../_core/entity/exames-graducao-alunos.entity';
import { Cobrancas } from '../_core/entity/cobrancas.entity';
import { AlunosModalidades } from 'src/_core/entity/alunos-modalidades.entity';
import { AlunosRepository } from './alunos.repository';
import { PlanosModule } from 'src/planos/planos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Alunos,
      AlunosGraducaoHistorico,
      Graduacoes,
      ExamesGraducaoAlunos,
      AlunosModalidades,
    ]),
    PlanosModule,
  ],
  controllers: [AlunosController],
  providers: [AlunosService, AlunosRepository],
})
export class AlunosModule {}
