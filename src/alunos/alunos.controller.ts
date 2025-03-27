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
import { AtualizarGraduacaoDto } from './dto/atualizarGraducao.dto';
import { ListarAlunosQueryDto } from './dto/listarAlunos.dto';
import { GetUser } from 'src/_core/getUser.decorator';
import { User } from 'src/@types/user';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  async create(@Body() body: any, @GetUser() user: User) {
    return this.alunosService.create({
      ...body,
      academiaId: user.academiaId,
      clienteId: user.clienteId,
    });
  }

  @Get()
  async findAll(@Req() req, @Query() query: ListarAlunosQueryDto) {
    return this.alunosService.findAll({
      query,
      academiaId: req.user.academiaId,
    });
  }

  @Get('contagem')
  contagem(@Req() req) {
    return this.alunosService.contagem(req.user.clienteId, req.user.academiaId);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.alunosService.buscar(id);
  }

  @Patch('/:id/modalidade/:modalidadeId/graduacao/:graduacaoId')
  cadastrarGraduacao(@Param() atualizarGraduacaoDto: AtualizarGraduacaoDto) {
    return this.alunosService.atualizarGraduacao(atualizarGraduacaoDto);
  }

  @Put(':id')
  put(@Param('id') id: string, @Body() body: any) {
    return this.alunosService.put({ id, ...body });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.alunosService.delete(id);
  }

  // @Get('modalidade/:id')
  // async findAllByModalidade(@Param('id') id: string) {
  //   return this.alunosService.getByModalidade(id);
  // }
}
