import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from 'src/_core/entity/usuarios.entity';
import { UsuarioRepository } from './repositories/usuario.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios])],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuarioRepository],
  exports: [UsuariosService],
})
export class UsuariosModule {}
