import { Module } from '@nestjs/common';
import { PrecosService } from './precos.service';
import { PrecosController } from './precos.controller';
import { Precos } from '../_core/entity/precos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Precos])],
  controllers: [PrecosController],
  providers: [PrecosService],
})
export class PrecoModule {
}
