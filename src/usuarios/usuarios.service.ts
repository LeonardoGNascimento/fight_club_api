import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRepository } from './repositories/usuario.repository';
import { AdminRepository } from './repositories/admin.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existingUser = await this.usuarioRepository.findByEmail(
      createUsuarioDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    const newUser = await this.usuarioRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
    });

    const { password, ...result } = newUser;
    return result;
  }

  async findByEmail(email: string) {
    return await this.usuarioRepository.findByEmail(email);
  }

  async isAdmin(usuarioId: string): Promise<boolean> {
    const admin = await this.adminRepository.findByUsuarioId(usuarioId);
    return !!admin;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne(id);

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    const data = { ...updateUsuarioDto };

    if (updateUsuarioDto.password) {
      data.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    const updatedUser = await this.usuarioRepository.update(id, data);

    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: string) {
    const usuario = await this.usuarioRepository.findOne(id);

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.usuarioRepository.softDelete(id);

    return { message: 'Usuário removido com sucesso' };
  }

  async createAdmin(usuarioId: string) {
    const usuario = await this.usuarioRepository.findOne(usuarioId);

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`);
    }

    const existingAdmin = await this.adminRepository.findByUsuarioId(usuarioId);

    if (existingAdmin) {
      throw new ConflictException('Usuário já é um administrador');
    }

    return await this.adminRepository.create(usuarioId);
  }

  async removeAdmin(usuarioId: string) {
    const usuario = await this.usuarioRepository.findOne(usuarioId);

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`);
    }

    const admin = await this.adminRepository.findByUsuarioId(usuarioId);

    if (!admin) {
      throw new NotFoundException('Usuário não é um administrador');
    }

    await this.adminRepository.remove(usuarioId);

    return { message: 'Privilégio de administrador removido com sucesso' };
  }
}
