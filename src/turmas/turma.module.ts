import { Module } from '@nestjs/common';
import { TurmaController } from './turma.controller';
import { TurmaService } from './turma.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turmas } from '../_core/entity/turmas.entity';
import { TurmaRepository } from './turma.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Turmas])],
  controllers: [TurmaController],
  providers: [TurmaService, TurmaRepository],
})
export class TurmaModule {}
