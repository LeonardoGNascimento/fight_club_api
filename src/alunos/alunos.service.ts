import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { format, lastDayOfMonth } from 'date-fns';
import { PrismaService } from 'src/_core/prisma.service';
import { CobrancaService } from 'src/cobrancas/cobranca.service';
import { AtualizarGraduacaoDto } from './dto/atualizarGraducao.dto';
import { CreateAlunoDto } from './dto/createAluno.dto';
import { ListarAlunosDto } from './dto/listarAlunos.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alunos } from '../_core/entity/alunos.entity';
import { Repository } from 'typeorm';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';
import { CobrancasClienteItemsTipo } from '../_core/entity/cobrancas-cliente-items-tipo.enum';
import { async } from 'src/_core/async';

@Injectable()
export class AlunosService {
  constructor(
    private prisma: PrismaService,
    private cobrancaService: CobrancaService,
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
        .andWhere('cobrancasCliente.clientesId = :clientesId', { clientesId })
        .andWhere('cobrancasCliente.dataHora BETWEEN :startDate AND :endDate', {
          startDate: `${anoAtual}-${mes}-01`,
          endDate: ultimoDia,
        })
        .getMany();

    const alunosAtivos: number = await this.alunosRepository.count({
      where: {
        academiaId,
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
    const alunoModalidade = await this.prisma.alunosGraducao.findFirst({
      where: {
        alunosId: atualizarGraduacaoDto.id,
        modalidadesId: atualizarGraduacaoDto.modalidadeId,
      },
    });

    if (!alunoModalidade) {
      throw new BadRequestException('Aluno não treina essa modalidade');
    }

    await this.prisma.alunosGraducao.update({
      data: {
        graduacoesId: atualizarGraduacaoDto.graduacaoId,
      },
      where: {
        id: alunoModalidade.id,
      },
    });

    return true;
  }

  async create({ academiaId, clienteId, user, ...body }: CreateAlunoDto) {
    const plano = await this.prisma.planos.findFirst({
      where: {
        id: body.plano,
        deleted: null,
      },
    });

    if (!plano) {
      throw new NotFoundException({ error: 'Plano não encontrado' });
    }

    const contagem = await this.contagem(
      user.clienteId as string,
      user.academiaId as string,
    );

    const aluno = await this.prisma.alunos.create({
      data: {
        academiaId: String(user.academiaId),
        nome: body.nome,
        cep: body.cep,
        cidade: body.cidade,
        cpf: body.cpf,
        estado: body.estado,
        numero: body.numero,
        planosId: body.plano,
        rua: body.rua,
        telefone: body.telefone,
        status: plano.valor == '0' ? 'ATIVO' : 'PENDENTE',
      },
    });

    if (body.modalidades && body.modalidades.length > 0) {
      await Promise.all(
        body.modalidades.map(async (item) => {
          const graduacao = await this.prisma.graduacoes.findFirst({
            where: {
              modalidadesId: item,
              deleted: null,
              ordem: 1,
            },
          });

          const data: any = {
            alunosId: aluno.id,
            modalidadesId: item,
            graduacoesId: null,
          };

          if (graduacao) {
            data.graduacoesId = graduacao.id;
          }

          await this.prisma.alunosGraducao.create({
            data,
          });
        }),
      );
    }

    if (plano.valor !== '0') {
      await this.cobrancaService.lancarCobrancasPorAluno(aluno.id);
    }

    if (contagem.alunosAtivos === contagem.alunosPagos) {
      await this.cobrancaService.lancarValor({
        clientesId: user.clienteId as string,
        tipo: 'ALUNO',
      });
    }

    return aluno;
  }

  async findAll({ query, academiaId }: ListarAlunosDto) {
    const modalidade = query.modalidade;
    const plano = query.plano;
    const status = query.status;

    const whereClause: any = {
      academiaId,
      deleted: null,
    };

    if (modalidade && modalidade !== 'all') {
      whereClause.alunosGraducoes = {
        some: {
          modalidadesId: modalidade,
        },
      };
    }

    if (plano && plano !== 'all') {
      whereClause.planosId = plano;
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const alunos = await this.prisma.alunos.findMany({
      include: {
        plano: true,
        alunosGraducoes: {
          include: {
            modalidade: true,
          },
        },
      },
      where: whereClause,
    });

    return alunos.map((item) => {
      return {
        ...item,
        modalidades: item.alunosGraducoes.map((item2) => item2.modalidade.nome),
      };
    });
  }

  async put({ id, ...body }: any) {
    const aluno = await this.prisma.alunos.findUnique({
      where: {
        id,
      },
    });

    if (!aluno) {
      throw new NotFoundException({ error: 'Aluno não encontrado' });
    }

    const updatedAluno = await this.prisma.alunos.update({
      where: {
        id: aluno.id,
      },
      data: {
        nome: body.nome,
        cep: body.cep,
        cidade: body.cidade,
        cpf: body.cpf,
        estado: body.estado,
        numero: body.numero,
        planosId: body.plano,
        rua: body.rua,
        telefone: body.telefone,
        status: body.status,
      },
    });

    if (body.modalidades && body.modalidades.length > 0) {
      await this.prisma.alunosGraducao.deleteMany({
        where: {
          alunosId: aluno.id,
        },
      });

      await Promise.all(
        body.modalidades.map(async (modalidade: string) => {
          const graduacao = await this.prisma.graduacoes.findFirst({
            where: {
              modalidadesId: modalidade,
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

          await this.prisma.alunosGraducao.create({
            data,
          });
        }),
      );
    }

    return updatedAluno;
  }

  async delete(id: string) {
    const aluno = await this.prisma.alunos.findUnique({
      where: {
        id,
      },
    });

    if (!aluno) {
      throw new NotFoundException({ error: 'Aluno não encontrado' });
    }

    const deletedAluno = await this.prisma.alunos.update({
      data: {
        deleted: new Date(),
      },
      where: {
        id: aluno.id,
      },
    });

    await this.prisma.alunosExamesGraducao.updateMany({
      data: {
        deleted: new Date(),
      },
      where: {
        alunosId: aluno.id,
      },
    });

    await this.prisma.cobrancas.updateMany({
      data: {
        deleted: new Date(),
      },
      where: {
        alunosId: aluno.id,
      },
    });

    return deletedAluno;
  }
}
