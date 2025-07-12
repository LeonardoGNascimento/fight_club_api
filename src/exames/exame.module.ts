import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamesGraduacao } from 'src/_core/entity/exames-graduacao.entity';
import { ExamesGraducaoAlunos } from 'src/_core/entity/exames-graducao-alunos.entity';
import { ExameController } from './exame.controller';
import { ExameService } from './exame.service';
import { AlunosModule } from 'src/alunos/alunos.module';
import { ModalidadesModule } from 'src/modalidades/modalidades.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamesGraduacao, ExamesGraducaoAlunos]),
    AlunosModule,
    ModalidadesModule,
  ],
  controllers: [ExameController],
  providers: [ExameService],
})
export class ExameModule {}
