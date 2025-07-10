import { HttpException, Injectable } from '@nestjs/common';
import { CriarProfessorDto } from './dto/criar-professor.dto';
import { EditarProfessorDto } from './dto/editar-professor.dto';
import { ProfessoresRepository } from './professores.repository';

@Injectable()
export class ProfessoresService {
  constructor(private repository: ProfessoresRepository) {}

  async criar(dto: CriarProfessorDto) {
    const professor = await this.repository.criar(dto);

    if (!professor) {
      throw new HttpException('Ocorreu um erro ao salvar o professor', 500);
    }

    return professor;
  }

  async buscar(id: string) {
    const professor = await this.repository.buscar(id);

    if (!professor) {
      throw new HttpException('Nao foi possivel buscar o professor', 500);
    }

    return professor;
  }

  async listar(academiaId: string) {
    return await this.repository.listar(academiaId);
  }

  async editar(dto: EditarProfessorDto) {
    const professor = await this.repository.editar(dto);

    if (!professor) {
      throw new HttpException('Ocorreu um erro ao editar o professor', 500);
    }

    return professor;
  }

  async deletar(id: string) {
    const professor = await this.repository.deletar(id);

    if (!professor) {
      throw new HttpException('Ocorreu um erro ao deletar o professor', 500);
    }

    return professor;
  }
}
