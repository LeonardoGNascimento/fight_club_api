import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/_core/prisma.service';

@Injectable()
export class AcademiasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.academias.findMany({
      where: {
        deleted: null,
        // clienteId: `${user.privateMetadata.clienteId}`,
      },
    });
  }
}
