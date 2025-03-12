import { Injectable } from '@nestjs/common';
import { addDays, endOfMonth, format } from 'date-fns';
import { PrismaService } from 'src/_core/prisma.service';
import { Agendas } from '@prisma/client';

@Injectable()
export class AgendaService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async listar(academiaId: string): Promise<Agendas[]> {
    const aulas = await this.prisma.agendas.findMany({
      include: {
        modalidade: true,
      },
      where: {
        academiasId: String(academiaId),
        deleted: null,
      },
    });

    return aulas.map((item) => {
      return {
        ...item,
        id: item.id,
        title: item.modalidade.nome,
        start: item.dataInicio,
        end: item.dataFinal,
        tipo: item.tipo,
      };
    });
  }

  async detalhes(id: string) {
    const aula = await this.prisma.agendas.findFirst({
      include: {
        Chamada: {
          include: {
            aluno: true,
          },
        },
        modalidade: {
          include: {
            graduacoes: true,
          },
        },
      },
      where: {
        id,
        deleted: null,
      },
    });

    const alunos = await this.prisma.alunosGraducao.findMany({
      include: {
        aluno: true,
        graduacao: true,
      },
      where: {
        modalidadesId: aula.modalidadesId,
      },
    });

    return { aula, alunos };
  }

  async criar(body: any): Promise<boolean> {
    if (body.id) {
      await this.prisma.agendas.update({
        data: {
          dataInicio: new Date(`${body.data} ${body.inicio}`),
          dataFinal: new Date(`${body.data} ${body.fim}`),
        },
        where: {
          id: String(body.id),
        },
      });

      return true;
    }

    const dataInicial = new Date(`${body.data} ${body.inicio}`);
    const dataFinal: Date = endOfMonth(dataInicial);

    let dataAula: Date = dataInicial;

    const datas = [
      {
        academiasId: String(body.academiaId),
        dataHora: new Date(),
        dataInicio: dataAula,
        dataFinal: new Date(`${body.data} ${body.fim}`),
        modalidadesId: String(body.modalidades),
        tipo: body.tipo,
      },
    ];

    dataAula = addDays(dataInicial, 1);

    if (body.repetir) {
      while (dataAula <= dataFinal) {
        if (body.dias.includes(format(dataAula, 'iiii'))) {
          datas.push({
            academiasId: String(body.academiaId),
            dataHora: new Date(),
            dataInicio: dataAula,
            dataFinal: new Date(`${body.data} ${body.fim}`),
            modalidadesId: String(body.modalidades),
            tipo: body.tipo,
          });
        }

        dataAula = addDays(dataAula, 1);
      }
    }

    await this.prisma.agendas.createMany({
      data: datas,
    });

    return true;
  }
}
