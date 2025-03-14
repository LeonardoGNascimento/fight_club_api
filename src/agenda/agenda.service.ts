import { Injectable } from '@nestjs/common';
import { addDays, endOfMonth, format } from 'date-fns';
import { PrismaService } from 'src/_core/prisma.service';
import { Agendas } from '@prisma/client';
import { CriarTurmaDto } from './DTO/criarTurma.dto';
import { Turmas } from '../_core/entity/turmas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AgendaService {
  constructor(
    private prisma: PrismaService,
    @InjectRepository(Turmas) private turmaRepository: Repository<Turmas>,
  ) {}

  async listarTurmas(academiaId: string): Promise<Turmas[]> {
    return await this.turmaRepository.find({
      where: {
        modalidade: {
          academiasId: academiaId,
        },
      },
    });
  }

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

  async criarTurma(body: CriarTurmaDto): Promise<Turmas> {
    return this.turmaRepository.save({
      ...body,
      modalidadesId: body.modalidadeId,
    });
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

  async delete(id: string) {
    await this.prisma.agendas.delete({ where: { id: String(id) } });

    return true;
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
        academiasId: String(academiaId),
        dataInicio: {
          gte: startOfDay, // Maior ou igual ao início do dia
          lte: endOfDay, // Menor ou igual ao fim do dia
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
}
