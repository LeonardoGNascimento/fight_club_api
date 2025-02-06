import { Module } from '@nestjs/common';
import { AcademiasService } from './academias.service';
import { AcademiasController } from './academias.controller';

@Module({
  controllers: [AcademiasController],
  providers: [AcademiasService],
})
export class AcademiasModule {}
