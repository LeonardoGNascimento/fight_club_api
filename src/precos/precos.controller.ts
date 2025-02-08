import { Controller, Get, Query } from '@nestjs/common';
import { PrecosService } from './precos.service';

@Controller('precos')
export class PrecosController {
  constructor(private service: PrecosService) {}

  @Get()
  findAll(@Query() filtros: any) {
    return this.service.findAll(filtros);
  }
}
