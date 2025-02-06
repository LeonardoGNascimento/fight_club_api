import { Injectable } from '@nestjs/common';
import { TiposCobrancas } from '@prisma/client';
import {
  differenceInDays,
  format,
  getDaysInMonth,
  lastDayOfMonth,
} from 'date-fns';
import { PrismaService } from 'src/_core/prisma.service';

@Injectable()
export class CobrancaService {
  constructor(private prisma: PrismaService) {}

  async lancarCobrancasPorAluno(idAluno: string) {
    const alunos = await this.prisma.alunos.findMany({
      where: {
        id: idAluno,
        deleted: null,
        plano: {
          valor: {
            not: '0',
          },
        },
      },
      include: {
        plano: true,
      },
    });

    const dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate() + 5);

    return await Promise.all(
      alunos.map(async (item) => {
        await this.prisma.cobrancas.create({
          data: {
            tipo: TiposCobrancas.MENSALIDADE,
            valor: Number(item.plano.valor),
            vencimento: dataAtual,
            academiasId: item.academiaId,
            alunosId: item.id,
            dataHora: new Date(),
          },
        });
      }),
    );
  }

  async lancarValor({ clientesId, tipo }: any) {
    const dataAtual = new Date();
    const mes = format(dataAtual, 'MM');
    const anoAtual = format(dataAtual, 'yyyy');
    const ultimoDia = lastDayOfMonth(dataAtual);

    const diasRestantesMes = differenceInDays(ultimoDia, dataAtual);
    const diasDoMes = getDaysInMonth(dataAtual);

    let cobranca = await this.prisma.cobrancasCliente.findFirst({
      where: {
        clientesId,
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
          clientesId,
          vencimento: new Date(),
          dataHora: new Date(),
          pago: false,
        },
      });
    }

    const valor = await this.prisma.precos.findFirst({
      where: {
        tipo,
      },
    });

    if (!valor) {
      return;
    }

    let precoTotal = valor.valor;

    if (
      ['FINANCEIRO', 'MENSALIDADE', 'PAGAMENTOS', 'CALENDARIO'].includes(tipo)
    ) {
      precoTotal = (valor.valor / diasDoMes) * diasRestantesMes;
    }

    await this.prisma.cobrancasClienteItems.create({
      data: {
        dataHora: new Date(),
        qtd: 1,
        valor: precoTotal,
        cobrancasClienteId: cobranca.id,
        tipo,
      },
    });
  }
}
