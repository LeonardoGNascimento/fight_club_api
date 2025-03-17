import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CriarTurmaDto } from './DTO/criarTurma.dto';
import { Turmas } from '../_core/entity/turmas.entity';
import { GetUser } from '../_core/getUser.decorator';
import { User } from '../@types/user';

@Controller('turma')
export class TurmaController {
  constructor(private service: TurmaService) {}

  @Get()
  async listarTurma(@GetUser() user: User): Promise<Turmas[]> {
    return this.service.listar(user.academiaId);
  }

  @Post()
  criarTurma(@Body() body: CriarTurmaDto): Promise<Turmas> {
    return this.service.criar(body);
  }

  @Delete('/:id')
  @HttpCode(204)
  deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }
}
