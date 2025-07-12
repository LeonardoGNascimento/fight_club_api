import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
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

  @Put(':id/concluir')
  atualizar(@Param('exameId') exameId: string, @Body() body: any) {
    return this.service.atualizar(exameId, body);
  }
}
