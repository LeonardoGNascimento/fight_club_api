import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/_core/prisma.service';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async mensalidade(clientesId: string) {
    return this.prisma.cobrancasCliente.findMany({
      include: {
        items: true,
      },
      where: {
        clientesId,
      },
    });
  }
}
