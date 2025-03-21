import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Graduacoes } from '../_core/entity/graduacoes.entity';
import { Modalidades } from '../_core/entity/modalidades.entity';

@Injectable()
export class ModalidadesService {
  constructor(
    @InjectRepository(Graduacoes)
    private graduacoesRepository: Repository<Graduacoes>,
    @InjectRepository(Modalidades)
    private modalidadesRepository: Repository<Modalidades>,
  ) {}

  async create({ nome, academiasId, graduacoes, id }: any) {
    const modalidade = await this.modalidadesRepository.save({
      id,
      dataHora: new Date(),
      nome,
      academia: {
        id: academiasId,
      },
    });

    if (graduacoes && graduacoes.length > 0) {
      for (const [index, item] of graduacoes.entries()) {
        await this.graduacoesRepository.save({
          ...item,
          modalidade: {
            id: modalidade.id,
          },
          ordem: index + 1,
        });
      }
    }

    return modalidade;
  }

  async findAll(academiaId: string): Promise<Modalidades[]> {
    return await this.modalidadesRepository.find({
      relations: {
        graduacoes: true,
      },
      where: {
        academia: {
          id: academiaId,
        },
      },
    });
  }

  async find(id: string): Promise<Modalidades> {
    return await this.modalidadesRepository.findOne({
      relations: {
        graduacoes: true,
      },
      where: {
        id,
      },
      order: {
        graduacoes: {
          ordem: 'ASC',
        },
      },
    });
  }
}
