import { Injectable } from '@nestjs/common';
import { SalvarHistoricoGraduacao } from './dto/salvar-historico-graduacao';
import { GraduacaoRepository } from './graduacao.repository';
import { AlunosGraducaoHistorico } from 'src/_core/entity/alunos-graducao-historico.entity';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Graduacoes } from 'src/_core/entity/graduacoes.entity';

@Injectable()
export class GraduacaoService {
  constructor(private graduacaoRepository: GraduacaoRepository) {}

  async historicoAluno(alunoId: string, modalidadeId: string) {
    return await this.graduacaoRepository.historicoAluno(alunoId, modalidadeId);
  }

  async historicoSalvar(
    salvarHistoricoGraduacao: SalvarHistoricoGraduacao,
  ): Promise<AlunosGraducaoHistorico> {
    return await this.graduacaoRepository.historicoSalvar(
      salvarHistoricoGraduacao,
    );
  }

  async find(where: FindOneOptions<Graduacoes>) {
    return await this.graduacaoRepository.find(where);
  }
}
