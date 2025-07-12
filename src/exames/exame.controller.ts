import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ExameService } from './exame.service';
import { Response } from 'express';

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
  async atualizar(
    @Param('id') exameId: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const buffer = await this.service.atualizar(exameId, body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
    res.send(buffer);
  }
}
