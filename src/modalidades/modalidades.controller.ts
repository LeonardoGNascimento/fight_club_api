import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ModalidadesService } from './modalidades.service';
import { GetUser } from '../_core/getUser.decorator';
import { User } from '../@types/user';
import { Modalidades } from '../_core/entity/modalidades.entity';

@Controller('modalidades')
export class ModalidadesController {
  constructor(private readonly modalidadesService: ModalidadesService) {}

  @Post()
  async create(@Body() body: any) {
    return this.modalidadesService.create(body);
  }

  @Get()
  findAll(@GetUser() user: User): Promise<Modalidades[]> {
    return this.modalidadesService.findAll(user.academiaId);
  }
}
