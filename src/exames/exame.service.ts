import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ExamesGraduacao,
  StatusExame,
} from 'src/_core/entity/exames-graduacao.entity';
import { ExamesGraducaoAlunos } from 'src/_core/entity/exames-graducao-alunos.entity';
import { Modalidades } from 'src/_core/entity/modalidades.entity';
import { AlunosService } from 'src/alunos/alunos.service';
import { ModalidadesService } from 'src/modalidades/modalidades.service';
import { Repository } from 'typeorm';

@Injectable()
export class ExameService {
  constructor(
    @InjectRepository(ExamesGraduacao)
    private examesGraduacaoRepository: Repository<ExamesGraduacao>,
    @InjectRepository(ExamesGraducaoAlunos)
    private examesGraducaoAlunosRepository: Repository<ExamesGraducaoAlunos>,
    private alunosService: AlunosService,
    private modalidadeService: ModalidadesService,
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
        alunosExamesGraducoes: {
          aluno: true,
          graduacaoAtual: true,
          graduacaoPretendida: true,
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
      await Promise.all(
        body.alunos.map(async (item: { value: string }) => {
          const aluno = await this.alunosService.buscar(item.value);
          const modalidade = aluno.modalidades.find(
            (item) => item.modalidade.id === body.modalidadeId,
          );

          const graduacaoAtual = modalidade.graduacao.id;
          const modalidadeAtual = await this.modalidadeService.find(
            body.modalidadeId,
          );

          const graduacaoPretendida = modalidadeAtual.graduacoes.find(
            (item) =>
              item.ordem ===
              modalidadeAtual.graduacoes.find(
                (item) => item.id === graduacaoAtual,
              ).ordem +
                1,
          ).id;

          return this.examesGraducaoAlunosRepository.save({
            aluno: {
              id: item.value,
            },
            examesGraduacao: {
              id: exame.id,
            },
            graduacaoAtual: {
              id: graduacaoAtual,
            },
            graduacaoPretendida: {
              id: graduacaoPretendida,
            },
          });
        }),
      );
    }

    return exame;
  }

  async atualizar(exameId: string, body: any) {
    if (!body.alunos || !Array.isArray(body.alunos)) {
      throw new Error('Array de alunos é obrigatório.');
    }

    const resultados = [];

    for (const alunoData of body.alunos) {
      const { alunoId, status } = alunoData;

      if (!alunoId || !status) {
        throw new Error('Aluno e status são obrigatórios para cada aluno.');
      }

      const exameAluno = await this.examesGraducaoAlunosRepository.findOne({
        relations: {
          graduacaoAtual: true,
          graduacaoPretendida: {
            modalidade: true,
          },
        },
        where: {
          aluno: { id: alunoId },
          examesGraduacao: { id: exameId },
        },
      });

      if (!exameAluno) {
        throw new Error(`Exame do aluno não encontrado.`);
      }

      if (status === 'aprovado') {
        this.alunosService.atualizarGraduacao({
          graduacaoId: exameAluno.graduacaoPretendida.id,
          id: alunoId,
          modalidadeId: exameAluno.graduacaoPretendida.modalidade.id,
        });
      }

      exameAluno.status = status;
      const exameAlunoAtualizado =
        await this.examesGraducaoAlunosRepository.save(exameAluno);

      resultados.push(exameAlunoAtualizado);
    }

    console.log(exameId);
    
    await this.examesGraduacaoRepository.update(
      { id: exameId },
      {
        status: StatusExame.finalizado,
      },
    );

    return resultados;
  }
}
