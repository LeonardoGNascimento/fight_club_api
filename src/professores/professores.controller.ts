import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetUser } from 'src/_core/getUser.decorator';
import { User } from 'src/@types/user';
import { ProfessoresService } from './professores.service';
import { CriarProfessorDto } from './dto/criarProfessor.dto';
import { EditarProfessorDto } from './dto/editarProfessor.dto';

@Controller('professores')
export class ProfessoresController {
  constructor(private serviceProfessores: ProfessoresService) {}

  @Get(':id')
  async buscar(@Param('id') id: string) {
    return await this.serviceProfessores.buscar(id);
  }

  @Get()
  async listar(@GetUser() user: User) {
    return await this.serviceProfessores.listar(user.academiaId);
  }

  @Post()
  async criar(@Body() dto: CriarProfessorDto, @GetUser() user: User) {
    return await this.serviceProfessores.criar({ ...dto, academiaId: user.academiaId });
  }

  @Put()
  async editar(@Body() dto: EditarProfessorDto, @GetUser() user: User) {
    return await this.serviceProfessores.editar({ ...dto, academiaId: user.academiaId });
  }

  @Delete(':id')
  async deletar(@Param('id') id: string) {
    return await this.serviceProfessores.deletar(id);
  }
}
