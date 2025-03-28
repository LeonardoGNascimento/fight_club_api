import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PlanosService } from './planos.service';
import { CriarPlanoDto } from './dto/criarPlano.dto';
import { GetUser } from 'src/_core/getUser.decorator';
import { User } from 'src/@types/user';
import { EditarPlanoDto } from './dto/editarPlano.dto';

@Controller('planos')
export class PlanosController {
  constructor(private servicePlanos: PlanosService) {}

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.servicePlanos.buscar(id);
  }

  @Get()
  listar(@GetUser() user: User) {
    return this.servicePlanos.listar(user.academiaId);
  }

  @Post()
  criar(@Body() dto: CriarPlanoDto, @GetUser() user: User) {
    return this.servicePlanos.criar({ ...dto, academiaId: user.academiaId });
  }

  @Put()
  editar(@Body() dto: EditarPlanoDto, @GetUser() user: User) {
    return this.servicePlanos.editar({ ...dto, academiaId: user.academiaId });
  }

  @Delete(':id')
  deletar(@Param('id') id: string) {
    return this.servicePlanos.deletar(id);
  }
}
