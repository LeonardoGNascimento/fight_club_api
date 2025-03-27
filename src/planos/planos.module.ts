import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planos } from 'src/_core/entity/planos.entity';
import { PlanosController } from './planos.controller';
import { PlanosRepository } from './planos.repository';
import { PlanosService } from './planos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Planos])],
  controllers: [PlanosController],
  providers: [PlanosService, PlanosRepository],
})
export class PlanosModule {}
