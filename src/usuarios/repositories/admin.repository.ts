import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../../_core/entity/admin.entity';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(usuarioId: string): Promise<Admin> {
    const admin = this.adminRepository.create({ usuario: { id: usuarioId } });
    return this.adminRepository.save(admin);
  }

  async findByUsuarioId(usuarioId: string): Promise<Admin> {
    return this.adminRepository.findOne({
      where: { usuario: { id: usuarioId } },
    });
  }

  async remove(usuarioId: string): Promise<void> {
    await this.adminRepository.delete({ usuario: { id: usuarioId } });
  }
}
