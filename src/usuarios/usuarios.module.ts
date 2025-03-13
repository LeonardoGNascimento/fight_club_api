import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { UsuariosEntity } from './entities/usuario.entity';
import { AdminEntity } from './entities/admin.entity';
import { UsuarioRepository } from './repositories/usuario.repository';
import { AdminRepository } from './repositories/admin.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuariosEntity, AdminEntity]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuarioRepository, AdminRepository],
  exports: [UsuariosService],
})
export class UsuariosModule {}