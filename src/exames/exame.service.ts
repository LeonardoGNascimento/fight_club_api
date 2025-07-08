import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamesGraduacao } from 'src/_core/entity/exames-graduacao.entity';
import { Modalidades } from 'src/_core/entity/modalidades.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExameService {
  constructor(
    @InjectRepository(ExamesGraduacao)
    private examesGraduacaoRepository: Repository<ExamesGraduacao>,
  ) {}

  async listar() {
    return await this.examesGraduacaoRepository.find({
      relations: {
        modalidade: true,
      },
    });
  }

  async criar(body: any) {
    return await this.examesGraduacaoRepository.save({
      dataAgendamento: body.dataAgendamento,
      modalidade: {
        id: body.modalidadeId,
      },
    });
  }
}
