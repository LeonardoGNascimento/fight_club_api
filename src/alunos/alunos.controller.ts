import { User } from '@clerk/express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req
} from '@nestjs/common';
import { CurrentUser } from 'src/_core/decorator/currentUser.decorator';
import { AlunosService } from './alunos.service';
import { AtualizarGraduacaoDto } from './dto/atualizarGraducao.dto';

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
    @Query() query: any,
    @Req() req: any,
  ) {
    return this.alunosService.findAll({
      query,
      academiaId: user.privateMetadata.academiaId,
    });
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
