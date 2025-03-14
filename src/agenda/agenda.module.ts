import { Module } from '@nestjs/common';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turmas } from '../_core/entity/turmas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turmas])],
  controllers: [AgendaController],
  providers: [AgendaService],
})
export class AgendaModule {}
