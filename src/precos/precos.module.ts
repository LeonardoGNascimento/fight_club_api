import { Module } from '@nestjs/common';
import { PrecosService } from './precos.service';
import { PrecosController } from './precos.controller';

@Module({
  controllers: [PrecosController],
  providers: [PrecosService],
})
export class PrecoModule {}
