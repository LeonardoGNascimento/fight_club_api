import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format, lastDayOfMonth } from 'date-fns';
import { async } from 'src/_core/async';
import { AlunosModalidades } from 'src/_core/entity/alunos-modalidades.entity';
import { Repository } from 'typeorm';
import { AlunosGraducaoHistorico } from '../_core/entity/alunos-graducao-historico.entity';
import { Alunos, Status } from '../_core/entity/alunos.entity';
import { Cobrancas } from '../_core/entity/cobrancas.entity';
import { ExamesGraducaoAlunos } from '../_core/entity/exames-graducao-alunos.entity';
import { Graduacoes } from '../_core/entity/graduacoes.entity';
import { Planos } from '../_core/entity/planos.entity';
import { AtualizarGraduacaoDto } from './dto/atualizar-graducao.dto';
import { CreateAlunoDto } from './dto/criar-aluno.dto';
import { ListarAlunosDto } from './dto/listar-alunos.dto';
import { DetalhesAlunosQuery } from './query/detalhes-aluno.query';
import { AlunosRepository } from './alunos.repository';
import { PlanosService } from 'src/planos/planos.service';

@Injectable()
export class AlunosService {
  constructor(
    @InjectRepository(ExamesGraducaoAlunos)
    private alunosExameGraduacaoRepository: Repository<ExamesGraducaoAlunos>,
    @InjectRepository(Graduacoes)
    private graduacoesRepository: Repository<Graduacoes>,
    @InjectRepository(AlunosGraducaoHistorico)
    private alunosGraduacaoHistoricoRepository: Repository<AlunosGraducaoHistorico>,
    @InjectRepository(AlunosModalidades)
    private alunosModalidadesRepository: Repository<AlunosModalidades>,
    @InjectRepository(Alunos) private alunosRepository: Repository<Alunos>,

    private repository: AlunosRepository,
    private planosService: PlanosService,
  ) {}

  async buscar(id: string): Promise<Alunos> {
    const aluno = await this.repository.buscar(id);

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const retorno = new DetalhesAlunosQuery(aluno);

    await Promise.all(
      aluno.alunosModalidades.map(async (item) => {
        const [alunoGraduacaoHistorico] = await async<any[]>(
          this.alunosGraduacaoHistoricoRepository
            .createQueryBuilder('historico')
            .innerJoinAndSelect(
              Graduacoes,
              'graduacoes',
              'graduacoes.id = historico.graduacaoId',
            )
            .where('historico.alunoId = :alunoId', { alunoId: aluno.id })
            .andWhere('historico.modalidadeId = :modalidadeId', {
              modalidadeId: item.modalidade.id,
            })
            .orderBy('historico.dataHora', 'DESC')
            .getRawMany(),
        );

        alunoGraduacaoHistorico.forEach((item2) =>
          retorno.addHistoricoGraduacao(
            {
              id: item2.historico_id,
              dataHora: item2.historico_dataHora,
              nome: item2.graduacoes_nome,
              instrutor: item2.historico_instrutor,
              observacao: item2.historico_observacao,
              grau: item2.historico_grau,
            },
            item.modalidade.id,
          ),
        );
      }),
    );

    return retorno;
  }

  async atualizarGraduacao(atualizarGraduacaoDto: AtualizarGraduacaoDto) {
    const alunoModalidade = await this.alunosModalidadesRepository.findOne({
      where: {
        aluno: {
          id: atualizarGraduacaoDto.id,
        },
        modalidade: {
          id: atualizarGraduacaoDto.modalidadeId,
        },
      },
    });

    if (!alunoModalidade) {
      throw new BadRequestException('Aluno não treina essa modalidade');
    }

    const graduacao = await this.graduacoesRepository.findOneBy({
      id: atualizarGraduacaoDto.graduacaoId,
    });

    this.alunosGraduacaoHistoricoRepository.save({
      instrutor: atualizarGraduacaoDto.instrutor,
      observacao: atualizarGraduacaoDto.observacao,
      grau:
        graduacao.qtdGraus >= atualizarGraduacaoDto.grau
          ? atualizarGraduacaoDto.grau
          : null,
      graduacao: {
        id: atualizarGraduacaoDto.graduacaoId,
      },
      aluno: {
        id: atualizarGraduacaoDto.id,
      },
      modalidade: {
        id: atualizarGraduacaoDto.modalidadeId,
      },
    });

    await this.alunosModalidadesRepository.update(
      {
        aluno: {
          id: atualizarGraduacaoDto.id,
        },
        modalidade: {
          id: atualizarGraduacaoDto.modalidadeId,
        },
      },
      {
        graduacao: {
          id: atualizarGraduacaoDto.graduacaoId,
        },
        aluno: {
          id: atualizarGraduacaoDto.id,
        },
        grau:
          graduacao.qtdGraus >= atualizarGraduacaoDto.grau
            ? atualizarGraduacaoDto.grau
            : null,
      },
    );

    return true;
  }

  async create({ academiaId, clienteId, user, ...body }: CreateAlunoDto) {
    const plano = await this.planosService.buscar(body.plano)

    const aluno = await this.alunosRepository.save({
      academia: { id: String(academiaId) },
      nome: body.nome,
      cep: body.cep,
      cidade: body.cidade,
      cpf: body.cpf,
      estado: body.estado,
      numero: body.numero,
      plano: { id: body.plano },
      rua: body.rua,
      telefone: body.telefone,
      status: plano.valor == '0' ? Status.ATIVO : Status.PENDENTE,
    });

    if (body.modalidades && body.modalidades.length > 0) {
      await Promise.all(
        body.modalidades.map(async (item) => {
          const graduacao = await this.graduacoesRepository.findOne({
            where: {
              modalidade: {
                id: item,
              },
              deleted: null,
              ordem: 1,
            },
          });

          await this.alunosModalidadesRepository.save({
            grau: graduacao && graduacao.qtdGraus > 0 ? 0 : null,
            aluno: { id: aluno.id },
            modalidade: {
              id: item,
            },
            graduacao: graduacao
              ? {
                  id: graduacao.id,
                }
              : null,
          });

          await this.alunosGraduacaoHistoricoRepository.save({
            grau: graduacao.qtdGraus > 0 ? 0 : null,
            aluno: { id: aluno.id },
            modalidade: {
              id: item,
            },
            graduacao: {
              id: graduacao?.id,
            },
          });
        }),
      );
    }

    return aluno;
  }

  async findAll({ query, academiaId }: ListarAlunosDto) {
    const { modalidade, plano, status } = query;

    const whereClause: any = {
      academia: {
        id: academiaId,
      },
      deleted: null,
      ...(modalidade &&
        modalidade !== 'all' && {
          alunosGraduacoes: { modalidade: { id: modalidade } },
        }),
      ...(plano && plano !== 'all' && { plano: { id: plano } }),
      ...(status && status !== 'all' && { status }),
    };

    const alunos = await this.alunosRepository.find({
      relations: {
        plano: true,
        alunosGraducaoHistorico: true,
        alunosModalidades: {
          modalidade: true,
        },
      },
      where: whereClause,
    });

    return alunos.map((item) => ({
      ...item,
      modalidades: item.alunosModalidades.map((item2) => item2.modalidade.nome),
    }));
  }

  async put({ id, ...body }: any) {
    return await this.alunosRepository.save({
      id,
      ...body,
    });
  }

  async deletar(id: string) {
    const aluno = await this.alunosRepository.findOne({
      where: {
        id,
      },
    });

    if (!aluno) {
      throw new NotFoundException({ error: 'Aluno não encontrado' });
    }

    const deletedAluno = await this.alunosRepository.update(aluno.id, {
      deleted: new Date(),
    });

    await this.alunosExameGraduacaoRepository.update(
      {
        aluno: {
          id: aluno.id,
        },
      },
      {
        deleted: new Date(),
      },
    );

    return deletedAluno;
  }
}
