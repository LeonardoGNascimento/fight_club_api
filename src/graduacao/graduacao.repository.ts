import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlunosGraducaoHistorico } from 'src/_core/entity/alunos-graducao-historico.entity';
import { ExamesGraducaoAlunos } from 'src/_core/entity/exames-graducao-alunos.entity';
import { Graduacoes } from 'src/_core/entity/graduacoes.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { SalvarHistoricoGraduacao } from './dto/salvar-historico-graduacao';

@Injectable()
export class GraduacaoRepository {
  constructor(
    @InjectRepository(AlunosGraducaoHistorico)
    private alunosGraduacaoHistoricoRepository: Repository<AlunosGraducaoHistorico>,
    @InjectRepository(ExamesGraducaoAlunos)
    private alunosExameGraduacaoRepository: Repository<ExamesGraducaoAlunos>,
    @InjectRepository(Graduacoes)
    private graduacoesRepository: Repository<Graduacoes>,
  ) {}

  async historicoAluno(alunoId: string, modalidadeId: string) {
    return await this.alunosGraduacaoHistoricoRepository
      .createQueryBuilder('historico')
      .innerJoinAndSelect(
        Graduacoes,
        'graduacoes',
        'graduacoes.id = historico.graduacaoId',
      )
      .where('historico.alunoId = :alunoId', { alunoId: alunoId })
      .andWhere('historico.modalidadeId = :modalidadeId', {
        modalidadeId: modalidadeId,
      })
      .orderBy('historico.dataHora', 'DESC')
      .getRawMany();
  }

  async historicoSalvar(
    salvarHistoricoGraduacao: SalvarHistoricoGraduacao,
  ): Promise<AlunosGraducaoHistorico> {
    return await this.alunosGraduacaoHistoricoRepository.save({
      grau: salvarHistoricoGraduacao.grau,
      aluno: { id: salvarHistoricoGraduacao.alunoId },
      modalidade: {
        id: salvarHistoricoGraduacao.modalidadeId,
      },
      graduacao: {
        id: salvarHistoricoGraduacao.graduacaoId,
      },
      instrutor: salvarHistoricoGraduacao.instrutor,
      observacao: salvarHistoricoGraduacao.observacao,
    });
  }

  async find(where: FindOneOptions<Graduacoes>): Promise<Graduacoes> {
    return await this.graduacoesRepository.findOne(where);
  }
}
