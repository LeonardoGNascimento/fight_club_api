import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { AtualizarGraduacaoDto } from './dto/atualizar-graducao.dto';
import { ListarAlunosQueryDto } from './dto/listar-alunos.dto';
import { GetUser } from 'src/_core/getUser.decorator';
import { User } from 'src/@types/user';
import { Alunos } from 'src/_core/entity/alunos.entity';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  create(@Body() body: any, @GetUser() user: User): Promise<Alunos> {
    return this.alunosService.create({
      ...body,
      academiaId: user.academiaId,
      clienteId: user.clienteId,
    });
  }

  @Get()
  findAll(@Req() req, @Query() query: ListarAlunosQueryDto): Promise<Alunos[]> {
    return this.alunosService.listar({
      query,
      academiaId: req.user.academiaId,
    });
  }

  @Get(':id')
  buscar(@Param('id') id: string): Promise<Alunos> {
    return this.alunosService.buscar(id);
  }

  @Patch('/:id/modalidade/:modalidadeId/graduacao/:graduacaoId')
  cadastrarGraduacao(
    @Param() atualizarGraduacaoDto: AtualizarGraduacaoDto,
    @Body() body: any,
  ) {
    return this.alunosService.atualizarGraduacao({
      ...atualizarGraduacaoDto,
      ...body,
    });
  }

  @Put(':id')
  put(@Param('id') id: string, @Body() body: Exclude<Alunos, 'id'>): Promise<Alunos> {
    return this.alunosService.put({ id, ...body });
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.alunosService.deletar(id);
  }
}
