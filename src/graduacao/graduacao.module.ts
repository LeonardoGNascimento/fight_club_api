import { Module } from '@nestjs/common';
import { GraducaoController } from './graducao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunosGraducao } from '../_core/entity/alunos-graducao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlunosGraducao])],
  controllers: [GraducaoController],
})
export class GraduacaoModule {
}
