import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminEntity } from './entities/admin.entity';
import { UsuariosEntity } from './entities/usuario.entity';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<UsuariosEntity> {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuariosEntity> {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.usuariosService.remove(id);
  }

  @Post(':id/admin')
  @UseGuards(AdminGuard)
  createAdmin(@Param('id') id: string): Promise<AdminEntity> {
    return this.usuariosService.createAdmin(id);
  }

  @Delete(':id/admin')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAdmin(@Param('id') id: string): Promise<void> {
    return this.usuariosService.removeAdmin(id);
  }
}
