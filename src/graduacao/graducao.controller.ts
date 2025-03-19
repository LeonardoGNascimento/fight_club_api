import { Controller, Get, HttpException, Req } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AlunosGraducao } from '../_core/entity/alunos-graducao.entity';
import { ListarGraduacoesQuery } from './query/listarGraduacoes.query';

@Controller('graduacoes')
export class GraducaoController {
  constructor(
    @InjectRepository(AlunosGraducao)
    private alunosGraduacaoRepository: Repository<AlunosGraducao>,
  ) {}

  @Get()
  async listar(@Req() req) {
    try {
      const graduacoes: AlunosGraducao[] = await this.alunosGraduacaoRepository
        .createQueryBuilder('alunosGraducao')
        .innerJoinAndSelect(
          'alunosGraducao.aluno',
          'aluno',
          'aluno.deleted IS NULL AND aluno.academiaId = :academiaId',
          { academiaId: req.user.academiaId },
        )
        .innerJoinAndSelect('alunosGraducao.graduacao', 'graduacao')
        .leftJoinAndSelect('alunosGraducao.modalidade', 'modalidade')
        .leftJoinAndSelect(
          'modalidade.graduacoes',
          'modalidadeGraduacao',
          'modalidadeGraduacao.deleted IS NULL',
        )
        .where('alunosGraducao.deleted IS NULL')
        .orderBy('aluno.nome', 'ASC')
        .addOrderBy('graduacao.ordem', 'ASC')
        .getMany();

      return graduacoes.map((grad: AlunosGraducao) => {
        const totalGraduacoes: number = grad.modalidade.graduacoes.length;
        const grauAtual: number = grad.graduacao?.ordem || 0;
        const qtdGraus: number = grad.graduacao?.qtdGraus || 0;

        return {
          ...grad,
          grauInfo: {
            atual: grauAtual,
            total: totalGraduacoes,
            qtdGraus,
            proxima: grauAtual < totalGraduacoes ? grauAtual + 1 : null,
          },
        };
      });
    } catch (error) {
      throw new HttpException({ error: 'Erro ao buscar graduações' }, 500);
    }
  }
}
