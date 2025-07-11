import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamesGraduacao } from 'src/_core/entity/exames-graduacao.entity';
import { ExamesGraducaoAlunos } from 'src/_core/entity/exames-graducao-alunos.entity';
import { Modalidades } from 'src/_core/entity/modalidades.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExameService {
  constructor(
    @InjectRepository(ExamesGraduacao)
    private examesGraduacaoRepository: Repository<ExamesGraduacao>,
    @InjectRepository(ExamesGraducaoAlunos)
    private examesGraducaoAlunosRepository: Repository<ExamesGraducaoAlunos>,
  ) {}

  async listar() {
    return await this.examesGraduacaoRepository.find({
      relations: {
        modalidade: true,
      },
    });
  }

  async buscar(id: string) {
    const exame = await this.examesGraduacaoRepository.findOne({
      relations: {
        modalidade: {
          graduacoes: true,
          alunosModalidades: {
            aluno: true,
            graduacao: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return exame;
  }

  async criar(body: any) {
    const exame = await this.examesGraduacaoRepository.save({
      dataAgendamento: body.dataAgendamento,
      modalidade: {
        id: body.modalidadeId,
      },
    });

    if (body.alunos && Array.isArray(body.alunos)) {
      Promise.all(
        body.alunos.map((item: { value: string }) =>
          this.examesGraducaoAlunosRepository.save({
            aluno: {
              id: item.value,
            },
            examesGraduacao: {
              id: exame.id,
            },
          }),
        ),
      );
    }

    return exame;
  }
}
