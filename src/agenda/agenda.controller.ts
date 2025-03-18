import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CriarTurmaDto } from './dto/criarTurma.dto';
import { Turmas } from '../_core/entity/turmas.entity';
import { GetUser } from '../_core/getUser.decorator';
import { User } from '../@types/user';
import { AgendasEntity } from './entities/agenda.entity';

@Controller('agenda')
export class AgendaController {
  constructor(private service: AgendaService) {}

  @Get()
  async listar(@GetUser() user: User): Promise<AgendasEntity[]> {
    return await this.service.listar(user.academiaId);
  }

  @Get('/proximos')
  proximos(@GetUser() user: User) {
    return this.service.proximos(user.academiaId);
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
