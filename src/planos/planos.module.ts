import { Module } from '@nestjs/common';
import { PlanosController } from './planos.controller';
import { PlanosService } from './planos.service';

@Module({
  imports: [],
  controllers: [PlanosController],
  providers: [PlanosService],
})
export class PlanosModule {}
