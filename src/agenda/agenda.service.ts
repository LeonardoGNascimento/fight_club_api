import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/_core/prisma.service';
import { RedisService } from 'src/_core/redis.config';
import { ClerkClient } from '@clerk/clerk-sdk-node';

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
}
