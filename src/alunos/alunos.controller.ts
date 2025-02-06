import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { JwtAuthGuard } from 'src/_core/auth.guard';
import { clerkClient } from '@clerk/express';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const user = await clerkClient.users.getUser(req.auth.userId);

    return this.alunosService.create({
      ...body,
      academiaId: user.privateMetadata.academiaId,
      clienteId: user.privateMetadata.clienteId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: any, @Req() req: any) {
    const user = await clerkClient.users.getUser(req.auth.userId);

    return this.alunosService.findAll({
      query,
      academiaId: user.privateMetadata.academiaId,
    });
  }
}
