import { Module } from '@nestjs/common';
import { GraducaoController } from './graducao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunosGraducaoHistorico } from '../_core/entity/alunos-graducao-historico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlunosGraducaoHistorico])],
  controllers: [GraducaoController],
})
export class GraduacaoModule {
}
