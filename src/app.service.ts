import { Injectable } from '@nestjs/common';
import { PrismaService } from './_core/prisma.service';
import { lastDayOfMonth } from 'date-fns';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async proximos(academiaId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const aulas = await this.prisma.agendas.findMany({
      include: {
        modalidade: true,
      },
      where: {
        academiasId: academiaId,
        dataInicio: {
          gte: startOfDay,
          lte: endOfDay,
        },
        deleted: null,
      },
      orderBy: {
        dataInicio: 'asc',
      },
    });

    return aulas.map((item) => {
      return {
        id: item.id,
        title: item.modalidade.nome,
        start: item.dataInicio,
        end: item.dataFinal,
        tipo: item.tipo,
      };
    });
  }

  async atrasadas(academiaId: string) {
    return await this.prisma.cobrancas.findMany({
      include: {
        aluno: {
          include: {
            plano: true,
          },
        },
      },
      where: {
        pago: false,
        deleted: null,
        academia: {
          id: academiaId,
        },
        vencimento: {
          lt: new Date(), // 'lt' significa "menor que" (comparando com a data atual)
        },
      },
    });
  }

  async lucro(academiaId: string) {
    const resultado = await this.prisma.cobrancas.aggregate({
      _sum: {
        valor: true,
      },
      where: {
        pago: true,
        academia: {
          id: academiaId,
        },
      },
    });

    return resultado._sum.valor ? resultado._sum.valor : null;
  }

  async prejuiso(academiaId: string) {
    const resultado = await this.prisma.cobrancas.aggregate({
      _sum: {
        valor: true,
      },
      where: {
        pago: false,
        academia: {
          id: academiaId,
        },
        vencimento: {
          lt: new Date(), // 'lt' significa "menor que" (comparando com a data atual)
        },
        deleted: null,
      },
    });

    return resultado._sum.valor ? resultado._sum.valor : null;
  }

  async mensalidade(id: string) {
    const valor = await this.prisma.cobrancasClienteItems.findMany({
      where: {
        deleted: null,
        CobrancasCliente: {
          clientesId: String(id),
        },
      },
    });

    return Number(valor.reduce((acc, item) => acc + item.valor, 0));
  }

  async permissoes(clientesId: string) {
    const ultimoDia = lastDayOfMonth(new Date());
    ultimoDia.setHours(0, 0, 0, 0);

    return await this.prisma.clienteModulos.findMany({
      where: {
        clientesId,
        OR: [
          {
            dataVencimento: {
              lt: ultimoDia,
            },
          },
          {
            dataVencimento: null,
          },
        ],
      },
    });
  }

  async dashboard(academiaId: string, clienteId: string) {
    return {
      proximos: await this.proximos(academiaId),
      atrasadas: await this.atrasadas(academiaId),
      lucros: await this.lucro(academiaId),
      prejuiso: await this.prejuiso(academiaId),
      mensalidade: await this.mensalidade(clienteId),
      permissoes: await this.permissoes(clienteId),
    };
  }
}
