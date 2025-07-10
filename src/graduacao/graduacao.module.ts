import { Module } from '@nestjs/common';
import { GraducaoController } from './graducao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunosGraducaoHistorico } from '../_core/entity/alunos-graducao-historico.entity';
import { GraduacaoService } from './graduacao.service';
import { GraduacaoRepository } from './graduacao.repository';
import { ExamesGraducaoAlunos } from 'src/_core/entity/exames-graducao-alunos.entity';
import { Graduacoes } from 'src/_core/entity/graduacoes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AlunosGraducaoHistorico,
      ExamesGraducaoAlunos,
      Graduacoes,
    ]),
  ],
  controllers: [GraducaoController],
  providers: [GraduacaoService, GraduacaoRepository],
  exports: [GraduacaoService],
})
export class GraduacaoModule {}
