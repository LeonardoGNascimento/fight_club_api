import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { Agendas } from '@prisma/client';
import { CriarTurmaDto } from './DTO/criarTurma.dto';
import { Turmas } from '../_core/entity/turmas.entity';
import { GetUser } from '../_core/getUser.decorator';
import { User } from '../@types/user';

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

  @Get('/turma')
  async listarTurma(@GetUser() user: User) {
    console.log(user);
    return this.service.listarTurmas(user.academiaId);
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

  @Post('/turma')
  criarTurma(@Body() body: CriarTurmaDto): Promise<Turmas> {
    return this.service.criarTurma(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
