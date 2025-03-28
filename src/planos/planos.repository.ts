import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'src/_core/async';
import { Planos } from 'src/_core/entity/planos.entity';
import { Repository } from 'typeorm';
import { CriarPlanoDto } from './dto/criarPlano.dto';
import { ListarPlanosQuery } from './query/listarPlanos.query';

@Injectable()
export class PlanosRepository {
  constructor(
    @InjectRepository(Planos) private planosRepository: Repository<Planos>,
  ) {}

  async criar({ academiaId, descricao, nome, valor }: CriarPlanoDto) {
    const [data, error] = await async(
      this.planosRepository.save(
        this.planosRepository.create({
          academia: {
            id: academiaId,
          },
          descricao,
          nome,
          valor,
        }),
      ),
    );

    return error ? null : data;
  }

  async listar(academiaId: string): Promise<ListarPlanosQuery[]> {
    const [data, error] = await async(
      this.planosRepository.find({
        relations: {
          alunos: true,
        },
        where: {
          academia: {
            id: academiaId,
          },
        },
      }),
    );

    return error
      ? []
      : data.map((item: Planos) => ({
          id: item.id,
          nome: item.nome,
          descricao: item.descricao,
          valor: item.valor,
          totalAlunos: item.alunos.length,
          dataHora: item.dataHora,
          deleted: item.deleted,
        }));
  }
}
