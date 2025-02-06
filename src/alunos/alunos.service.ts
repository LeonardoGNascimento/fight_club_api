import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/_core/prisma.service';
import { CreateAlunoDto } from './dto/createAluno.dto';
import { CobrancaService } from 'src/cobrancas/cobranca.service';

@Injectable()
export class AlunosService {
  constructor(
    private prisma: PrismaService,
    private cobrancaService: CobrancaService,
  ) {}

  async create({ academiaId, clienteId, ...body }: CreateAlunoDto) {
    const plano = await this.prisma.planos.findFirst({
      where: {
        id: body.plano,
        deleted: null,
      },
    });

    if (!plano) {
      throw new NotFoundException('Plano não encontrado');
    }

    const aluno = await this.prisma.alunos.create({
      data: {
        academiaId: academiaId,
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

          let data: any = {
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

    await this.cobrancaService.lancarValor({
      clientesId: clienteId,
      tipo: 'ALUNO',
    });

    return aluno;
  }

  async findAll({ query, academiaId }: any) {
    const modalidade = query.modalidade;
    const plano = query.plano;
    const status = query.status;

    const whereClause: any = {
      academiaId: academiaId,
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

    const retorno = alunos.map((item) => {
      return {
        ...item,
        modalidades: item.alunosGraducoes.map((item2) => item2.modalidade.nome),
      };
    });

    return retorno;
  }
}
