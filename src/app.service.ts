import { Injectable } from '@nestjs/common';
import { PrismaService } from './_core/prisma.service';
import { format, lastDayOfMonth } from 'date-fns';
import { RedisService } from './_core/redis.config';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private cache: RedisService,
  ) {}

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

  async atrasadas(clienteId: string) {
    const cache = await this.cache.get(`${clienteId}:dashboard-atrasadas`);

    if (cache) {
      return cache;
    }

    const data = await this.prisma.cobrancas.findMany({
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
          cliente: {
            id: clienteId,
          },
        },
        vencimento: {
          lt: new Date(),
        },
      },
    });

    await this.cache.set(`${clienteId}:dashboard-atrasadas`, data, 3600);

    return data;
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

  async prejuiso(clienteId: string) {
    const cache = await this.cache.get(`${clienteId}:dashboard-prejuiso`);

    if (cache) {
      return cache;
    }

    const resultado = await this.prisma.cobrancas.aggregate({
      _sum: {
        valor: true,
      },
      where: {
        pago: false,
        academia: {
          cliente: {
            id: clienteId,
          },
        },
        vencimento: {
          lt: new Date(),
        },
        deleted: null,
      },
    });

    const result = resultado._sum.valor ? resultado._sum.valor : 0;

    await this.cache.set(`${clienteId}:dashboard-prejuiso`, result, 3600);

    return result;
  }

  async mensalidade(clientesId: string) {
    const cache = await this.cache.get(`${clientesId}:dashboard-mensalidade`);

    if (cache) {
      return cache;
    }

    const dataAtual = new Date();
    const mes = format(dataAtual, 'MM');
    const anoAtual = format(dataAtual, 'yyyy');
    const ultimoDia = lastDayOfMonth(dataAtual);

    const valor = await this.prisma.cobrancasClienteItems.aggregate({
      _sum: {
        valor: true,
      },
      where: {
        deleted: null,
        CobrancasCliente: {
          clientesId,
        },
        dataHora: {
          gte: new Date(`${anoAtual}-${mes}-01`),
          lt: ultimoDia,
        },
      },
    });

    await this.cache.set(`${clientesId}:dashboard-mensalidade`, valor, 3600);

    return valor;
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
