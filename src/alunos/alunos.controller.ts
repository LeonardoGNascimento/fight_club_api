import { User } from '@clerk/express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CurrentUser } from 'src/_core/decorator/currentUser.decorator';
import { AlunosService } from './alunos.service';
import { AtualizarGraduacaoDto } from './dto/atualizarGraducao.dto';
import { ListarAlunosQueryDto } from './dto/listarAlunos.dto';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  async create(@CurrentUser() user: User, @Body() body: any, @Req() req: any) {
    return this.alunosService.create({
      ...body,
      academiaId: user.privateMetadata.academiaId,
      clienteId: user.privateMetadata.clienteId,
    });
  }

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query() query: ListarAlunosQueryDto,
  ) {
    return this.alunosService.findAll({
      query,
      academiaId: user.privateMetadata.academiaId as string,
    });
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.alunosService.buscar(id);
  }

  @Get('contagem')
  contagem(@CurrentUser() user: User) {
    return this.alunosService.contagem(
      user.privateMetadata.clienteId as string,
      user.privateMetadata.academiaId as string,
    );
  }

  @Patch('/:id/modalidade/:modalidadeId/graduacao/:graduacaoId')
  atualizarGraduacao(@Param() atualizarGraduacaoDto: AtualizarGraduacaoDto) {
    return this.alunosService.atualizarGraduacao(atualizarGraduacaoDto);
  }

  // @Get('modalidade/:id')
  // async findAllByModalidade(@Param('id') id: string) {
  //   return this.alunosService.getByModalidade(id);
  // }
}
