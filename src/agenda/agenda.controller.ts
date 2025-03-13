import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { Agendas } from '@prisma/client';

@Controller('agenda')
export class AgendaController {
  constructor(private service: AgendaService) {}

  @Get()
  async listar(@Req() req): Promise<Agendas[]> {
    return await this.service.listar(req.user.academiaId);
  }

  @Get('/proximos')
  proximos(@Req() req: any) {
    return this.service.proximos(req.user.academiaId);
  }

  @Get(':id')
  detalhes(@Param('id') id: string) {
    return this.service.detalhes(id);
  }

  @Post()
  async criar(@Req() req, @Body() body): Promise<boolean> {
    return await this.service.criar({
      ...body,
      academiaId: req.user.academiaId,
    });
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.service.delete(id);
  }
}
