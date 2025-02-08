import { Injectable } from '@nestjs/common';
import { PrismaService } from './_core/prisma.service';
import {
  differenceInDays,
  format,
  getDaysInMonth,
  lastDayOfMonth,
} from 'date-fns';
import { RedisService } from './_core/redis.config';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private cache: RedisService,
  ) {}

  async cobrar() {
    const clientes = await this.prisma.clientes.findMany({
      where: {
        deleted: null,
        desconto: {
          not: 100,
        },
      },
    });

    const dataAtual = new Date();
    const mes = format(dataAtual, 'MM');
    const anoAtual = format(dataAtual, 'yyyy');
    const ultimoDia = lastDayOfMonth(dataAtual);

    for (const cliente of clientes) {
      let cobranca = await this.prisma.cobrancasCliente.findFirst({
        where: {
          clientesId: cliente.id,
          deleted: null,
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
      });

      if (!cobranca) {
        cobranca = await this.prisma.cobrancasCliente.create({
          data: {
            clientesId: cliente.id,
            vencimento: new Date(),
            dataHora: new Date(),
            pago: false,
          },
        });
      }

      const precoAluno = await this.prisma.precos.findFirst({
        where: {
          tipo: 'ALUNO',
        },
      });

      const precoModalidade = await this.prisma.precos.findFirst({
        where: {
          tipo: 'MODALIDADE',
        },
      });

      const precoPlano = await this.prisma.precos.findFirst({
        where: {
          tipo: 'PLANO',
        },
      });

      const modulos = await this.prisma.clienteModulos.findMany({
        where: {
          clientesId: cliente.id,
          dataVencimento: null,
        },
      });

      const diasRestantesMes = differenceInDays(ultimoDia, dataAtual);
      const diasDoMes = getDaysInMonth(dataAtual);

      await Promise.all(
        modulos.map(async (modulo) => {
          const jaCobrado = await this.prisma.cobrancasClienteItems.findFirst({
            where: {
              cobrancasClienteId: cobranca.id,
              tipo: modulo.modulo,
            },
          });

          if (jaCobrado) {
            return;
          }

          const preco = await this.prisma.precos.findFirst({
            where: {
              tipo: modulo.modulo,
            },
          });

          if (preco) {
            await this.prisma.cobrancasClienteItems.create({
              data: {
                dataHora: new Date(),
                qtd: 1,
                valor: (preco.valor / diasDoMes) * diasRestantesMes,
                cobrancasClienteId: cobranca.id,
                tipo: modulo.modulo,
              },
            });
          }
        }),
      );

      if (precoModalidade) {
        const qtdModalidadesJaLancados = await this.prisma.cobrancasClienteItems
          .findMany({
            where: {
              cobrancasClienteId: cobranca.id,
              tipo: 'MODALIDADE',
              deleted: null,
            },
          })
          .then((itens) =>
            itens.reduce((prev, curr) => {
              return prev + curr.qtd;
            }, 0),
          );

        const qtdModalidades = await this.prisma.modalidades.count({
          where: {
            academia: {
              clienteId: cliente.id,
            },
            deleted: null,
          },
        });

        const qtdModalidadesParaLancar =
          qtdModalidades - qtdModalidadesJaLancados;

        if (qtdModalidadesParaLancar > 0) {
          await this.prisma.cobrancasClienteItems.create({
            data: {
              dataHora: new Date(),
              qtd: qtdModalidadesParaLancar,
              valor: qtdModalidadesParaLancar * Number(precoModalidade.valor),
              cobrancasClienteId: cobranca.id,
              tipo: 'MODALIDADE',
            },
          });
        }
      }

      if (precoPlano) {
        const qtdPlanoJaLancados = await this.prisma.cobrancasClienteItems
          .findMany({
            where: {
              cobrancasClienteId: cobranca.id,
              tipo: 'PLANO',
              deleted: null,
            },
          })
          .then((itens) =>
            itens.reduce((prev, curr) => {
              return prev + curr.qtd;
            }, 0),
          );

        const qtdPlano = await this.prisma.planos.count({
          where: {
            academia: {
              clienteId: cliente.id,
            },
            deleted: null,
          },
        });

        const qtdParaLancar = qtdPlano - qtdPlanoJaLancados;

        if (qtdParaLancar > 0) {
          await this.prisma.cobrancasClienteItems.create({
            data: {
              dataHora: new Date(),
              qtd: qtdPlano - qtdPlanoJaLancados,
              valor: (qtdPlano - qtdPlanoJaLancados) * Number(precoPlano.valor),
              cobrancasClienteId: cobranca.id,
              tipo: 'PLANO',
            },
          });
        }
      }

      if (precoAluno) {
        const qtdAlunosJaLancados = await this.prisma.cobrancasClienteItems
          .findMany({
            where: {
              cobrancasClienteId: cobranca.id,
              tipo: 'ALUNO',
              deleted: null,
            },
          })
          .then((itens) =>
            itens.reduce((prev, curr) => {
              return prev + curr.qtd;
            }, 0),
          );

        const qtdAlunos = await this.prisma.alunos.count({
          where: {
            academia: {
              clienteId: cliente.id,
            },
            deleted: null,
          },
        });

        const qtdModalidadesParaLancar = qtdAlunos - qtdAlunosJaLancados;

        if (qtdModalidadesParaLancar > 0) {
          await this.prisma.cobrancasClienteItems.create({
            data: {
              dataHora: new Date(),
              qtd: qtdAlunos - qtdAlunosJaLancados,
              valor:
                (qtdAlunos - qtdAlunosJaLancados) * Number(precoAluno.valor),
              cobrancasClienteId: cobranca.id,
              tipo: 'ALUNO',
            },
          });
        }
      }
    }
  }

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
}
