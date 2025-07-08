import { Controller, Get } from '@nestjs/common';
import { ExameService } from './exame.service';

@Controller('exames')
export class ExameController {
  constructor(private service: ExameService) {}

  @Get()
  listar() {
    return this.service.listar();
  }
}
