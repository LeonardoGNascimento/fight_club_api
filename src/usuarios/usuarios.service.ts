import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRepository } from './repositories/usuario.repository';
import { AdminRepository } from './repositories/admin.repository';
import * as bcrypt from 'bcrypt';
import { Admin } from '../_core/entity/admin.entity';
import { Usuarios } from 'src/_core/entity/usuarios.entity';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuarios> {
    const existingUser: Usuarios =
      await this.usuarioRepository.findByEmail(createUsuarioDto.email);

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword: string = await bcrypt.hash(
      createUsuarioDto.password,
      10,
    );

    return await this.usuarioRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string): Promise<Usuarios> {
    return await this.usuarioRepository.findByEmail(email);
  }

  async isAdmin(usuarioId: string): Promise<boolean> {
    return !!(await this.adminRepository.findByUsuarioId(usuarioId));
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuarios> {
    const usuario: Usuarios = await this.usuarioRepository.findOne(id);

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(
        updateUsuarioDto.password,
        10,
      );
    }

    return await this.usuarioRepository.update(id, updateUsuarioDto);
  }

  async remove(id: string): Promise<void> {
    const usuario: Usuarios = await this.usuarioRepository.findOne(id);

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.usuarioRepository.softDelete(id);
  }

  async createAdmin(usuarioId: string) {
    const usuario: Usuarios =
      await this.usuarioRepository.findOne(usuarioId);

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`);
    }

    const existingAdmin: Admin =
      await this.adminRepository.findByUsuarioId(usuarioId);

    if (existingAdmin) {
      throw new ConflictException('Usuário já é um administrador');
    }

    return await this.adminRepository.create(usuarioId);
  }

  async removeAdmin(usuarioId: string): Promise<void> {
    const usuario: Usuarios =
      await this.usuarioRepository.findOne(usuarioId);

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`);
    }

    const admin: Admin =
      await this.adminRepository.findByUsuarioId(usuarioId);

    if (!admin) {
      throw new NotFoundException('Usuário não é um administrador');
    }

    await this.adminRepository.remove(usuarioId);
  }
}
