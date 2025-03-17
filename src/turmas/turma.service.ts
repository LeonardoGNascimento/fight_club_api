import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarTurmaDto } from './DTO/criarTurma.dto';
import { Turmas } from '../_core/entity/turmas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { async } from '../_core/async';

@Injectable()
export class TurmaService {
  constructor(
    @InjectRepository(Turmas) private turmaRepository: Repository<Turmas>,
  ) {}

  async deletar(id: string): Promise<void> {
    const contagemAlunos = await this.turmaRepository.findOne({
      relations: ['alunosGraducoes'],
    });

    if (!contagemAlunos) {
      throw new NotFoundException('Turma não encontrada');
    }

    if (contagemAlunos.alunosGraducoes.length > 0) {
      throw new BadRequestException('Turma possui alunos');
    }

    await this.turmaRepository.delete(id);
  }

  async listar(academiaId: string): Promise<Turmas[]> {
    const [data, error] = await async<Turmas[]>(
      this.turmaRepository.find({
        where: {
          modalidade: {
            academiasId: academiaId,
          },
        },
      }),
    );

    if (error || data.length === 0) {
      throw new NotFoundException('Nenhuma turma encontrada');
    }

    return data;
  }

  async criar(body: CriarTurmaDto): Promise<Turmas> {
    const [data, error] = await async<Turmas>(
      this.turmaRepository.save({
        ...body,
        modalidadesId: body.modalidadeId,
      }),
    );

    if (error || !data) {
      throw new BadRequestException('Ocorreu um erro ao criar turma');
    }

    return data;
  }
}
