import { Injectable } from '@nestjs/common';
import { IListar } from './@types/IListar';
import { async } from 'src/_core/async';
import { InjectRepository } from '@nestjs/typeorm';
import { Precos } from '../_core/entity/precos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrecosService {
  constructor(@InjectRepository(Precos) private precoRepository: Repository<Precos>) {
  }

  async findAll(filtros?: IListar): Promise<Precos[]> {
    const queryBuilder = this.precoRepository.createQueryBuilder();

    if (filtros) {
      if (filtros.modulo && ['SIM', 'NAO'].includes(filtros.modulo)) {
        queryBuilder.andWhere('modulo = :modulo', { modulo: filtros.modulo === 'SIM' });
      }
    }

    const [result, error] = await async<Precos[]>(
      queryBuilder.getMany(),
    );

    if (error) {
      return [];
    }

    return result;
  }
}
