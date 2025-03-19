import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from 'src/_core/entity/usuarios.entity';
import { Admin } from '../_core/entity/admin.entity';
import { UsuarioRepository } from './repositories/usuario.repository';
import { AdminRepository } from './repositories/admin.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios, Admin])],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuarioRepository, AdminRepository],
  exports: [UsuariosService],
})
export class UsuariosModule {}
