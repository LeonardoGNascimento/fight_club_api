import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { clerkClient, User } from '@clerk/express';
import { CurrentUser } from 'src/_core/decorator/currentUser.decorator';

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

  @Get('modalidade/:id')
  async findAllByModalidade(@Param('id') id: string) {
    return this.alunosService.getByModalidade(id);
  }
}
