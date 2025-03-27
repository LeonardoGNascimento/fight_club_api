import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlanosService } from './planos.service';
import { CriarPlanoDto } from './dto/criarPlano.dto';
import { GetUser } from 'src/_core/getUser.decorator';
import { User } from 'src/@types/user';

@Controller('planos')
export class PlanosController {
  constructor(private service: PlanosService) {}

  @Get()
  listar(@GetUser() user: User) {
    return this.service.listar(user.academiaId);
  }

  @Post()
  criar(@Body() dto: CriarPlanoDto, @GetUser() user: User) {
    return this.service.criar({ ...dto, academiaId: user.academiaId });
  }
}
