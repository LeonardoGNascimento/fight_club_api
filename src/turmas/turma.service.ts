import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarTurmaDto } from './dto/criarTurma.dto';
import { Turmas } from '../_core/entity/turmas.entity';
import { AtualizarTurmaDto } from './dto/atualizarTurma.dto';
import { TurmaRepository } from './turma.repository';

@Injectable()
export class TurmaService {
  constructor(private turmaRepository: TurmaRepository) {}

  async atualizar(dto: AtualizarTurmaDto): Promise<Turmas> {
    await this.buscar(dto.id);
    return this.turmaRepository.atualizar(dto);
  }

  async buscar(id: string): Promise<Turmas> {
    const turma: Turmas = await this.turmaRepository.buscar(id);

    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }

    return turma;
  }

  async deletar(id: string): Promise<void> {
    const contagemAlunos: Turmas = await this.turmaRepository.buscar(id);

    if (!contagemAlunos) {
      throw new NotFoundException('Turma não encontrada');
    }

    if (contagemAlunos.alunosGraducoes.length > 0) {
      throw new BadRequestException('Turma possui alunos');
    }

    await this.turmaRepository.deletar(id);
  }

  async listar(academiaId: string): Promise<Turmas[]> {
    const turmas: Turmas[] = await this.turmaRepository.listar(academiaId);

    if (!turmas) {
      throw new NotFoundException('Nenhuma turma encontrada');
    }

    return turmas;
  }

  async criar(body: CriarTurmaDto): Promise<Turmas> {
    const turma: Turmas = await this.turmaRepository.criar(body);

    if (!turma) {
      throw new BadRequestException('Ocorreu um erro ao criar turma');
    }

    return turma;
  }
}
