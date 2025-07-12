import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlunosModalidades } from 'src/_core/entity/alunos-modalidades.entity';
import { GraduacaoService } from 'src/graduacao/graduacao.service';
import { Repository } from 'typeorm';
import { Alunos } from '../_core/entity/alunos.entity';
import { AlunosRepository } from './alunos.repository';
import { AtualizarGraduacaoDto } from './dto/atualizar-graducao.dto';
import { CreateAlunoDto } from './dto/criar-aluno.dto';
import { ListarAlunosDto } from './dto/listar-alunos.dto';
import { DetalhesAlunosQuery } from './query/detalhes-aluno.query';

@Injectable()
export class AlunosService {
  constructor(
    @InjectRepository(AlunosModalidades)
    private alunosModalidadesRepository: Repository<AlunosModalidades>,

    private repository: AlunosRepository,
    private graduacaoService: GraduacaoService,
  ) {}

  async buscar(id: string): Promise<DetalhesAlunosQuery> {
    const aluno = await this.repository.buscar(id);

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const retorno = new DetalhesAlunosQuery(aluno);

    await Promise.all(
      aluno.alunosModalidades.map(async (item) => {
        const alunoGraduacaoHistorico =
          await this.graduacaoService.historicoAluno(
            aluno.id,
            item.modalidade.id,
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

    const graduacao = await this.graduacaoService.find({
      where: {
        id: atualizarGraduacaoDto.graduacaoId,
      },
    });

    this.graduacaoService.historicoSalvar({
      instrutor: atualizarGraduacaoDto.instrutor,
      observacao: atualizarGraduacaoDto.observacao,
      grau:
        graduacao.qtdGraus >= atualizarGraduacaoDto.grau
          ? atualizarGraduacaoDto.grau
          : null,
      graduacaoId: atualizarGraduacaoDto.graduacaoId,
      alunoId: atualizarGraduacaoDto.id,
      modalidadeId: atualizarGraduacaoDto.modalidadeId,
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

  async create({ academiaId, user, ...body }: CreateAlunoDto) {
    const aluno = await this.repository.criar({
      academiaId: academiaId,
      nome: body.nome,
      cep: body.cep,
      cidade: body.cidade,
      cpf: body.cpf,
      estado: body.estado,
      numero: body.numero,
      plano: body.plano,
      rua: body.rua,
      telefone: body.telefone,
    });

    if (body.modalidades && body.modalidades.length > 0) {
      await Promise.all(
        body.modalidades.map(async (item) => {
          const graduacao = await this.graduacaoService.find({
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

          this.graduacaoService.historicoSalvar({
            alunoId: aluno.id,
            graduacaoId: graduacao?.id,
            modalidadeId: item,
            grau: graduacao.qtdGraus > 0 ? 0 : null,
          });
        }),
      );
    }

    return aluno;
  }

  async listar({ query, academiaId }: ListarAlunosDto) {
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

    const alunos = await this.repository.listar({
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

  async listarPorModalidade(id: string) {
    return await this.repository.listar({
      where: {
        alunosModalidades: {
          modalidade: {
            id,
          },
        },
      },
    });
  }

  async put({ id, ...body }: Partial<Alunos>) {
    return await this.repository.salvar({
      id,
      ...body,
    });
  }

  async deletar(id: string) {
    const aluno = await this.repository.buscar(id);

    if (!aluno) {
      throw new NotFoundException({ error: 'Aluno não encontrado' });
    }

    const deletedAluno = await this.repository.salvar({
      id,
      deleted: new Date(),
    });

    // await this.alunosExameGraduacaoRepository.update(
    //   {
    //     aluno: {
    //       id: aluno.id,
    //     },
    //   },
    //   {
    //     deleted: new Date(),
    //   },
    // );

    return deletedAluno;
  }
}
