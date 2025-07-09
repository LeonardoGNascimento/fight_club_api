import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professores } from 'src/_core/entity/professores.entity';
import { ProfessoresController } from './professores.controller';
import { ProfessoresRepository } from './professores.repository';
import { ProfessoresService } from './professores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Professores])],
  controllers: [ProfessoresController],
  providers: [ProfessoresService, ProfessoresRepository],
})
export class ProfessoresModule {}
