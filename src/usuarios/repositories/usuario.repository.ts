import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosEntity } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { asyncFunction } from '../../_core/async';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(UsuariosEntity)
    private readonly repo: Repository<UsuariosEntity>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuariosEntity> {
    try {
      const usuario: UsuariosEntity = this.repo.create({
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

  async findOne(id: string): Promise<UsuariosEntity> {
    const [data, erro] = await asyncFunction(
      this.repo.findOne({
        where: { id, deleted: null },
      }),
    );

    return erro ? null : data;
  }

  async findByEmail(email: string): Promise<UsuariosEntity> {
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
  ): Promise<UsuariosEntity> {
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
