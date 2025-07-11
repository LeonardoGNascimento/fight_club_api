import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExameService } from './exame.service';

@Controller('exames')
export class ExameController {
  constructor(private service: ExameService) {}

  @Get()
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.service.buscar(id);
  }

  @Post()
  criar(@Body() body: any) {
    return this.service.criar(body);
  }
}
