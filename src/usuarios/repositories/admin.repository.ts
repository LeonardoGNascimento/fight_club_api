import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '../entities/admin.entity';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async create(usuarioId: string): Promise<AdminEntity> {
    const admin = this.adminRepository.create({ usuarioId });
    return this.adminRepository.save(admin);
  }

  async findByUsuarioId(usuarioId: string): Promise<AdminEntity> {
    return this.adminRepository.findOne({
      where: { usuarioId },
    });
  }

  async remove(usuarioId: string): Promise<void> {
    await this.adminRepository.delete({ usuarioId });
  }
}
