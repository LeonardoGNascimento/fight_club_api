import { HttpException, Injectable } from '@nestjs/common';
import { PlanosRepository } from './planos.repository';
import { CriarPlanoDto } from './dto/criarPlano.dto';
import { EditarPlanoDto } from './dto/editarPlano.dto';

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

  async buscar(id: string){
    const plano = await this.respository.buscar(id);

    if (!plano) {
      throw new HttpException('Nao foi possivel buscar o plano', 500);
    }

    return plano;
  }

  async listar(academiaId: string) {
    return await this.respository.listar(academiaId);
  }

  async editar(dto: EditarPlanoDto) {
    const plano = await this.respository.editar(dto);

    if (!plano) {
      throw new HttpException('Ocorreu um erro ao editar o plano', 500);
    }

    return plano;
  }

  async deletar(id: string) {
    const plano = await this.respository.deletar(id);

    if (!plano) {
      throw new HttpException('Ocorreu um erro ao deletar o plano', 500);
    }

    return plano;
  }
}
