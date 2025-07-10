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
import { CriarPlanoDto } from './dto/criar-plano.dto';
import { GetUser } from 'src/_core/getUser.decorator';
import { User } from 'src/@types/user';
import { EditarPlanoDto } from './dto/editar-plano.dto';

@Controller('planos')
export class PlanosController {
  constructor(private servicePlanos: PlanosService) {}

  @Get(':id')
  async buscar(@Param('id') id: string) {
    return await this.servicePlanos.buscar(id);
  }

  @Get()
  async listar(@GetUser() user: User) {
    return await this.servicePlanos.listar(user.academiaId);
  }

  @Post()
  async criar(@Body() dto: CriarPlanoDto, @GetUser() user: User) {
    return await this.servicePlanos.criar({ ...dto, academiaId: user.academiaId });
  }

  @Put()
  async editar(@Body() dto: EditarPlanoDto, @GetUser() user: User) {
    return await this.servicePlanos.editar({ ...dto, academiaId: user.academiaId });
  }

  @Delete(':id')
  async deletar(@Param('id') id: string) {
    return await this.servicePlanos.deletar(id);
  }
}
