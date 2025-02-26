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
  async findAll(@Query() query: any, @Req() req: any) {
    const user = await clerkClient.users.getUser(req.auth.userId);

    return this.alunosService.findAll({
      query,
      academiaId: user.privateMetadata.academiaId,
    });
  }
}
