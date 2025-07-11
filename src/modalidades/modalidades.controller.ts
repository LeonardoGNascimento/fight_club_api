import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Graduacoes } from 'src/_core/entity/graduacoes.entity';
import { User } from '../@types/user';
import { Modalidades } from '../_core/entity/modalidades.entity';
import { GetUser } from '../_core/getUser.decorator';
import { ModalidadesService } from './modalidades.service';
import { Alunos } from 'src/_core/entity/alunos.entity';

@Controller('modalidades')
export class ModalidadesController {
  constructor(private readonly modalidadesService: ModalidadesService) {}

  @Post()
  async create(@Body() body: any, @GetUser() user: User) {
    return this.modalidadesService.create({
      ...body,
      academiasId: user.academiaId,
    });
  }

  @Get()
  findAll(@GetUser() user: User): Promise<Modalidades[]> {
    return this.modalidadesService.findAll(user.academiaId);
  }

  @Get('contagem')
  countAlunos(@GetUser() user: User): Promise<number> {
    return this.modalidadesService.contagem(user.academiaId);
  }

  @Get(':id/graduacao')
  findGraduacao(@Param('id') id: string): Promise<Graduacoes[]> {
    return this.modalidadesService.findGraduacao(id);
  }

  @Get(':id/alunos')
  listarAlunos(@Param('id') id: string): Promise<Alunos[]> {
    return this.modalidadesService.listarAlunos(id);
  }

  @Get(':id')
  find(@Param('id') id: string): Promise<Modalidades> {
    return this.modalidadesService.find(id);
  }
}
