import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamesGraduacao } from 'src/_core/entity/exames-graduacao.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExameService {
  constructor(
    @InjectRepository(ExamesGraduacao)
    private examesGraduacaoRepository: Repository<ExamesGraduacao>,
  ) {}

  async listar() {
    return await this.examesGraduacaoRepository.find();
  }
}
