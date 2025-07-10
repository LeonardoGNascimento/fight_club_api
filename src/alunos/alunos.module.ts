import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunosModalidades } from 'src/_core/entity/alunos-modalidades.entity';
import { GraduacaoModule } from 'src/graduacao/graduacao.module';
import { Alunos } from '../_core/entity/alunos.entity';
import { AlunosController } from './alunos.controller';
import { AlunosRepository } from './alunos.repository';
import { AlunosService } from './alunos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alunos, AlunosModalidades]),
    GraduacaoModule,
  ],
  controllers: [AlunosController],
  providers: [AlunosService, AlunosRepository],
})
export class AlunosModule {}
