import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/_core/prisma.service';
import { IListar } from './@types/IListar';
import { async } from 'src/_core/async';
import { Precos } from '@prisma/client';

@Injectable()
export class PrecosService {
  constructor(private prisma: PrismaService) {}

  async findAll(filtros?: IListar): Promise<Precos[]> {
    let where = {};

    if (filtros) {
      if (filtros.modulo && ['SIM', 'NAO'].includes(filtros.modulo)) {
        where = { ...where, modulo: filtros.modulo === 'SIM' };
      }
    }

    const [result, error] = await async<Precos[]>(
      this.prisma.precos.findMany({
        where,
      }),
    );

    if (error) {
      return [];
    }

    return result;
  }
}
