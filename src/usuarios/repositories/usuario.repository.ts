import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { asyncFunction } from '../../_core/async';
import { Usuarios } from 'src/_core/entity/usuarios.entity';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(Usuarios)
    private readonly repo: Repository<Usuarios>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuarios> {
    try {
      const usuario: Usuarios = this.repo.create({
        ...createUsuarioDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return await this.repo.save(usuario);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findOne(id: string): Promise<Usuarios> {
    const [data, erro] = await asyncFunction(
      this.repo.findOne({
        where: { id, deleted: null },
      }),
    );

    return erro ? null : data;
  }

  async findByEmail(email: string): Promise<Usuarios> {
    try {
      return await this.repo.findOne({
        where: { email, deleted: null },
      });
    } catch (e) {
      return null;
    }
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuarios> {
    try {
      await this.repo.update(id, updateUsuarioDto);
      return await this.findOne(id);
    } catch (e) {
      return null;
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      await this.repo.update(id, { deleted: new Date() });
    } catch (e) {
      return null;
    }
  }
}
