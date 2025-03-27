import { HttpException, Injectable } from '@nestjs/common';
import { PlanosRepository } from './planos.repository';
import { CriarPlanoDto } from './dto/criarPlano.dto';

@Injectable()
export class PlanosService {
  constructor(private respository: PlanosRepository) {}

  async criar(dto: CriarPlanoDto) {
    const plano = await this.respository.criar(dto);

    if (!plano) {
      throw new HttpException('Ocorreu um erro ao salvar plano', 500);
    }

    return plano;
  }

  async listar(academiaId: string) {
    const plano = await this.respository.listar(academiaId);

    if (plano.length === 0) {
      throw new HttpException('Nenhum plano encontrado', 404);
    }

    return plano;
  }
}
