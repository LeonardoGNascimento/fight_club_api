import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamesGraduacao } from 'src/_core/entity/exames-graduacao.entity';
import { ExamesGraducaoAlunos } from 'src/_core/entity/exames-graducao-alunos.entity';
import { ExameController } from './exame.controller';
import { ExameService } from './exame.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExamesGraduacao, ExamesGraducaoAlunos])],
  controllers: [ExameController],
  providers: [ExameService],
})
export class ExameModule {}
