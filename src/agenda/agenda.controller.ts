import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Agendas } from 'src/_core/entity/agendas.entity';
import { User } from '../@types/user';
import { GetUser } from '../_core/getUser.decorator';
import { AgendaService } from './agenda.service';

@Controller('agenda')
export class AgendaController {
  constructor(private service: AgendaService) {}

  @Get()
  async listar(@GetUser() user: User): Promise<Agendas[]> {
    return await this.service.listar(user.academiaId);
  }

  @Get('/proximos')
  proximos(@GetUser() user: User) {
    return this.service.proximos(user.academiaId);
  }

  @Get('aluno/:id/modalidade/:idModalidade/frequencia')
  buscarFrequencia(@Param('id') id: string) {
    return this.service.buscarFrequencia(id);
  }

  @Get(':id')
  detalhes(@Param('id') id: string) {
    return this.service.detalhes(id);
  }

  @Post()
  async criar(@GetUser() user: User, @Body() body): Promise<boolean> {
    return await this.service.criar({
      ...body,
      academiaId: user.academiaId,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
