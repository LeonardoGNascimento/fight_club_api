import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { format, lastDayOfMonth } from 'date-fns';
import { CobrancaService } from 'src/cobrancas/cobranca.service';
import { AtualizarGraduacaoDto } from './dto/atualizarGraducao.dto';
import { CreateAlunoDto } from './dto/createAluno.dto';
import { ListarAlunosDto } from './dto/listarAlunos.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alunos, Status } from '../_core/entity/alunos.entity';
import { Repository } from 'typeorm';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';
import { CobrancasClienteItemsTipo } from '../_core/entity/cobrancas-cliente-items-tipo.enum';
import { async } from 'src/_core/async';
import { AlunosGraducao } from '../_core/entity/alunos-graducao.entity';
import { Graduacoes } from '../_core/entity/graduacoes.entity';
import { Planos } from '../_core/entity/planos.entity';
import { AlunosExamesGraducao } from '../_core/entity/alunos-exames-graducao.entity';
import { Cobrancas } from '../_core/entity/cobrancas.entity';

@Injectable()
export class AlunosService {
  constructor(
    private cobrancaService: CobrancaService,
    @InjectRepository(Cobrancas)
    private cobrancasRepository: Repository<Cobrancas>,
    @InjectRepository(AlunosExamesGraducao)
    private alunosExameGraduacaoRepository: Repository<AlunosExamesGraducao>,
    @InjectRepository(Planos)
    private planosRepository: Repository<Planos>,
    @InjectRepository(Graduacoes)
    private graduacoesRepository: Repository<Graduacoes>,
    @InjectRepository(AlunosGraducao)
    private alunosGraduacaoRepository: Repository<AlunosGraducao>,
    @InjectRepository(Alunos) private alunosRepository: Repository<Alunos>,
    @InjectRepository(CobrancasClienteItems)
    private cobrancaClienteItemRepository: Repository<CobrancasClienteItems>,
  ) {}

  async buscar(id: string): Promise<Alunos> {
    const [aluno, erro] = await async<Alunos>(
      this.alunosRepository.findOne({
        where: {
          id: id,
          deleted: null,
        },
        relations: ['alunosGraducoes', 'alunosGraducoes.modalidade', 'plano'],
      }),
    );

    if (!aluno || erro) {
      throw new NotFoundException('Aluno não encontrado');
    }

    return aluno;
  }

  async contagem(
    clientesId: string,
    academiaId: string,
  ): Promise<{ alunosPagos: number; alunosAtivos: number }> {
    const dataAtual = new Date();
    const mes: string = format(dataAtual, 'MM');
    const anoAtual: string = format(dataAtual, 'yyyy');
    const ultimoDia: Date = lastDayOfMonth(dataAtual);

    const alunos: CobrancasClienteItems[] =
      await this.cobrancaClienteItemRepository
        .createQueryBuilder('cobrancaClienteItem')
        .innerJoinAndSelect(
          'cobrancaClienteItem.cobrancasCliente',
          'cobrancasCliente',
        )
        .where('cobrancaClienteItem.tipo = :tipo', {
          tipo: CobrancasClienteItemsTipo.ALUNO,
        })
        .andWhere('cobrancasCliente.clienteId = :clientesId', { clientesId })
        .andWhere('cobrancasCliente.dataHora BETWEEN :startDate AND :endDate', {
          startDate: `${anoAtual}-${mes}-01`,
          endDate: ultimoDia,
        })
        .getMany();

    const alunosAtivos: number = await this.alunosRepository.count({
      where: {
        academia: {
          id: academiaId,
        },
        deleted: null,
      },
    });

    return {
      alunosPagos: alunos.reduce(
        (prev: 0, actual: CobrancasClienteItems): number => {
          return prev + actual.qtd;
        },
        0,
      ),
      alunosAtivos,
    };
  }

  async atualizarGraduacao(atualizarGraduacaoDto: AtualizarGraduacaoDto) {
    const alunoModalidade = await this.alunosGraduacaoRepository.findOne({
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

    await this.alunosGraduacaoRepository.save({
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

    return true;
  }

  async create({ academiaId, clienteId, user, ...body }: CreateAlunoDto) {
    const plano = await this.planosRepository.findOne({
      where: {
        id: body.plano,
        deleted: null,
      },
    });

    if (!plano) {
      throw new NotFoundException({ error: 'Plano não encontrado' });
    }

    // const contagem = await this.contagem(
    //   clienteId as string,
    //   academiaId as string,
    // );

    const aluno = await this.alunosRepository.save(
      this.alunosRepository.create({
        academiaId: String(academiaId),
        nome: body.nome,
        cep: body.cep,
        cidade: body.cidade,
        cpf: body.cpf,
        estado: body.estado,
        numero: body.numero,
        planoId: body.plano,
        rua: body.rua,
        telefone: body.telefone,
        status: plano.valor == '0' ? Status.ATIVO : Status.PENDENTE,
      }),
    );

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

          const data = this.alunosGraduacaoRepository.create({
            aluno: { id: aluno.id },
            modalidade: {
              id: item,
            },
            graduacao: {
              id: graduacao?.id,
            },
          });

          await this.alunosGraduacaoRepository.save(data);
        }),
      );
    }

    if (plano.valor !== '0') {
      await this.cobrancaService.lancarCobrancasPorAluno(aluno.id);
    }

    // if (contagem.alunosAtivos === contagem.alunosPagos) {
    //   await this.cobrancaService.lancarValor({
    //     clientesId: clienteId as string,
    //     tipo: 'ALUNO',
    //   });
    // }

    return aluno;
  }

  async findAll({ query, academiaId }: ListarAlunosDto) {
    const { modalidade, plano, status } = query;

    // Constrói a cláusula where de forma mais direta
    const whereClause: any = {
      academiaId,
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
        alunosGraduacoes: { modalidade: true },
      },
      where: whereClause,
    });

    return alunos.map((item) => ({
      ...item,
      modalidades: item.alunosGraduacoes.map((item2) => item2.modalidade.nome),
    }));
  }

  async put({ id, ...body }: any) {
    const aluno = await this.alunosRepository.findOne({
      where: {
        id,
      },
    });

    if (!aluno) {
      throw new NotFoundException({ error: 'Aluno não encontrado' });
    }

    const updatedAluno = await this.alunosRepository.update(aluno.id, {
      nome: body.nome,
      cep: body.cep,
      cidade: body.cidade,
      cpf: body.cpf,
      estado: body.estado,
      numero: body.numero,
      plano: {
        id: body.plano,
      },
      rua: body.rua,
      telefone: body.telefone,
      status: body.status,
    });

    if (body.modalidades && body.modalidades.length > 0) {
      await this.alunosGraduacaoRepository
        .createQueryBuilder()
        .delete()
        .where('alunosId = :id', { id: aluno.id })
        .execute();

      await Promise.all(
        body.modalidades.map(async (modalidade: string) => {
          const graduacao = await this.graduacoesRepository.findOne({
            where: {
              modalidade: {
                id: modalidade,
              },
              deleted: null,
              ordem: 1,
            },
          });

          const data: any = {
            alunosId: aluno.id,
            modalidadesId: modalidade,
            graduacoesId: null,
          };

          if (graduacao) {
            data.graduacoesId = graduacao.id;
          }

          await this.alunosGraduacaoRepository.save(data);
        }),
      );
    }

    return updatedAluno;
  }

  async delete(id: string) {
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

    await this.cobrancasRepository.update(
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
