import { Injectable } from '@nestjs/common';
import { addDays, endOfMonth, format } from 'date-fns';
import { PrismaService } from 'src/_core/prisma.service';
import { RedisService } from 'src/_core/redis.config';

@Injectable()
export class AgendaService {
  constructor(
    private cacheManager: RedisService,
    private prisma: PrismaService,
  ) {}

  async listar(academiaId: string) {
    const cacheData = await this.cacheManager.get(`${academiaId}:agenda`);

    if (cacheData) {
      return cacheData;
    }

    const aulas = await this.prisma.agendas.findMany({
      include: {
        modalidade: true,
      },
      where: {
        academiasId: String(academiaId),
        deleted: null,
      },
    });

    const retorno = aulas.map((item) => {
      return {
        ...item,
        id: item.id,
        title: item.modalidade.nome,
        start: item.dataInicio,
        end: item.dataFinal,
        tipo: item.tipo,
      };
    });

    await this.cacheManager.set(`${academiaId}:agenda`, retorno, 100000);

    return retorno;
  }

  async criar(body: any) {
    await this.cacheManager.del(`${body.academiaId}:agenda`);

    if (body.id) {
      const aula = await this.prisma.agendas.update({
        data: {
          dataInicio: new Date(`${body.data} ${body.inicio}`),
          dataFinal: new Date(`${body.data} ${body.fim}`),
        },
        where: {
          id: String(body.id),
        },
      });

      return aula;
    }

    const dataInicial = new Date(`${body.data} ${body.inicio}`);
    const dataFinal = endOfMonth(dataInicial);

    let dataAula = dataInicial;

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
