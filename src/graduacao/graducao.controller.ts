import { User } from "@clerk/backend";
import { Controller, Get, HttpException } from "@nestjs/common";
import { CurrentUser } from "src/_core/decorator/currentUser.decorator";
import { PrismaService } from "src/_core/prisma.service";

@Controller('graduacoes')
export class GraducaoController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async listar(@CurrentUser() user: User) {
      try {
        const where = {
          deleted: null,
          aluno: {
            academiaId: user.privateMetadata.academiaId as string,
            deleted: null,
          },
        };
    
        const graduacoes = await this.prisma.alunosGraducao.findMany({
          where,
          include: {
            aluno: {
              select: {
                nome: true,
              },
            },
            graduacao: true,
            modalidade: {
              select: {
                nome: true,
                graduacoes: {
                  where: {
                    deleted: null,
                  },
                  orderBy: {
                    ordem: 'asc',
                  },
                },
              },
            },
          },
          orderBy: [
            {
              aluno: {
                nome: 'asc',
              },
            },
            {
              graduacao: {
                ordem: 'asc',
              },
            },
          ],
        });
    
        // Mapeia os resultados para incluir informações sobre o grau
        const graduacoesComGrau = graduacoes.map(grad => {
          const totalGraduacoes = grad.modalidade.graduacoes.length;
          const grauAtual = grad.graduacao?.ordem || 0;
          const qtdGraus = grad.graduacao?.qtdGraus || 0;
    
          return {
            ...grad,
            grauInfo: {
              atual: grauAtual,
              total: totalGraduacoes,
              qtdGraus,
              proxima: grauAtual < totalGraduacoes ? grauAtual + 1 : null,
            },
          };
        });
    
        return graduacoesComGrau
      } catch (error) {
        throw new HttpException({ error: "Erro ao buscar graduações" }, 500)
      }
  }
}