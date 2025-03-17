import { Module } from '@nestjs/common';
import { TurmaController } from './turma.controller';
import { TurmaService } from './turma.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turmas } from '../_core/entity/turmas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turmas])],
  controllers: [TurmaController],
  providers: [TurmaService],
})
export class TurmaModule {}
