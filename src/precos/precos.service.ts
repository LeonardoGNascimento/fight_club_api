import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/_core/prisma.service";
import { IListar } from "./@types/IListar";

@Injectable()
export class PrecosService {
  constructor(private prisma: PrismaService) {}

  async findAll(filtros?: IListar) {
    try {
      let where = {};

      if (filtros) {
        if (filtros.modulo && ["SIM", "NAO"].includes(filtros.modulo)) {
          where = { ...where, modulo: filtros.modulo === "SIM" };
        }
      }

      return await this.prisma.precos.findMany({
        where,
      });
    } catch (e) {
      return [];
    }
  }
}
