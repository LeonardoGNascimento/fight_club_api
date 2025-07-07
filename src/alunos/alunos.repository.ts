import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'src/_core/async';
import { Alunos } from 'src/_core/entity/alunos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlunosRepository {
  constructor(
    @InjectRepository(Alunos) private alunosRepository: Repository<Alunos>,
  ) {}

  async buscar(id: string) {
    const [aluno, erro] = await async<Alunos>(
      this.alunosRepository.findOne({
        relations: {
          plano: true,
          alunosModalidades: {
            modalidade: true,
            graduacao: true,
          },
        },
        where: {
          id,
          deleted: null,
        },
      }),
    );

    if (erro) {
      return null;
    }

    return aluno;
  }
}
