import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExameService } from './exame.service';

@Controller('exames')
export class ExameController {
  constructor(private service: ExameService) {}

  @Get()
  listar() {
    return this.service.listar();
  }

  @Post()
  criar(@Body() body: any) {
    return this.service.criar(body);
  }
}
