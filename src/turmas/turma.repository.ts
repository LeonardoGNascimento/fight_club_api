import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Turmas } from '../_core/entity/turmas.entity';
import { Repository } from 'typeorm';
import { AtualizarTurmaDto } from './dto/atualizarTurma.dto';
import { async } from '../_core/async';
import { CriarTurmaDto } from './dto/criarTurma.dto';

@Injectable()
export class TurmaRepository {
  constructor(
    @InjectRepository(Turmas) private turmaRepository: Repository<Turmas>,
  ) {}

  async atualizar({
    nome,
    modalidadeId,
    id,
  }: AtualizarTurmaDto): Promise<Turmas> {
    const turma: Turmas = this.turmaRepository.create();

    turma.id = id;

    if (nome) {
      turma.nome = nome;
    }

    if (modalidadeId) {
      turma.modalidadesId = modalidadeId;
    }

    const [data, error] = await async(this.turmaRepository.save(turma));

    if (!data || error) {
      return null;
    }

    return data;
  }

  async buscar(id: string): Promise<Turmas> {
    const [data, error] = await async(
      this.turmaRepository.find({
        where: { id },
        relations: ['modalidade', 'alunosGraducoes'],
      }),
    );

    if (error || !data) {
      return null;
    }

    return data;
  }

  async deletar(id: string): Promise<boolean> {
    const [data, error] = await async(this.turmaRepository.delete(id));

    return !error;
  }

  async criar(body: CriarTurmaDto): Promise<Turmas> {
    const [data, error] = await async<Turmas>(
      this.turmaRepository.save({
        ...body,
        modalidadesId: body.modalidadeId,
      }),
    );

    if (error || !data) {
      return null;
    }

    return data;
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
      return null;
    }

    return data;
  }
}
