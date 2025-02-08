import { Body, Controller, Get, Post } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { User } from '@clerk/backend';
import { CurrentUser } from 'src/_core/decorator/currentUser.decorator';

@Controller('agenda')
export class AgendaController {
  constructor(private service: AgendaService) {}

  @Get()
  async listar(@CurrentUser() user: User) {
    return await this.service.listar(user.privateMetadata.academiaId as string);
  }

  @Post()
  async criar(@CurrentUser() user: User, @Body() body: any) {
    return await this.service.criar({
      ...body,
      academiaId: user.privateMetadata.academiaId,
    });
  }
}
