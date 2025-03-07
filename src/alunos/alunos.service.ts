import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { format, lastDayOfMonth } from 'date-fns';
import { PrismaService } from 'src/_core/prisma.service';
import { CobrancaService } from 'src/cobrancas/cobranca.service';
import { AtualizarGraduacaoDto } from './dto/atualizarGraducao.dto';
import { CreateAlunoDto } from './dto/createAluno.dto';
import { ListarAlunosDto } from './dto/listarAlunos.dto';

@Injectable()
export class AlunosService {
  constructor(
    private prisma: PrismaService,
    private cobrancaService: CobrancaService,
  ) {}

  async buscar(id: string) {
    try {
      const aluno = await this.prisma.alunos.findUnique({
        include: {
          alunosGraducoes: {
            include: {
              modalidade: true,
            },
          },
          plano: true,
        },
        where: {
          id,
          deleted: null,
        },
      });

      if (!aluno) {
        throw new NotFoundException('Aluno não encontrado');
      }

      return aluno;
    } catch (error: any) {
      throw new InternalServerErrorException({
        error: 'Erro ao buscar o aluno',
        details: error.message,
      });
    }
  }

  async contagem(clientesId: string, academiaId: string) {
    const dataAtual = new Date();
    const mes = format(dataAtual, 'MM');
    const anoAtual = format(dataAtual, 'yyyy');
    const ultimoDia = lastDayOfMonth(dataAtual);

    const alunos = await this.prisma.cobrancasClienteItems.findMany({
      where: {
        CobrancasCliente: {
          clientesId,
          AND: [
            {
              dataHora: {
                gte: new Date(`${anoAtual}-${mes}-01`),
              },
            },
            {
              dataHora: {
                lt: ultimoDia,
              },
            },
          ],
        },

        tipo: 'ALUNO',
      },
    });

    const alunosAtivos = await this.prisma.alunos.count({
      where: {
        academiaId,
        deleted: null,
      },
    });

    return {
      alunosPagos: alunos.reduce((prev, actual) => {
        return prev + actual.qtd;
      }, 0),
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
      user.privateMetadata.clienteId as string,
      user.privateMetadata.academiaId as string,
    );

    const aluno = await this.prisma.alunos.create({
      data: {
        academiaId: String(user.privateMetadata.academiaId),
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
        clientesId: user.privateMetadata.clienteId as string,
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

  async getByModalidade(id: string) {
    const result = await this.prisma.alunosGraducao.findMany({
      where: {
        modalidadesId: id,
      },
    });
  }
}
