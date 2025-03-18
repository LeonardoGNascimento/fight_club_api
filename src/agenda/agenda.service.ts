import { Injectable } from '@nestjs/common';
import { addDays, endOfMonth, format } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Agendas } from '../_core/entity/agendas.entity';
import { AlunosGraducao } from '../_core/entity/alunos-graducao.entity';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agendas) private agendaRepository: Repository<Agendas>,
    @InjectRepository(AlunosGraducao)
    private alunosGraduacaoService: Repository<AlunosGraducao>,
  ) {}

  async listar(academiaId: string): Promise<Agendas[]> {
    const aulas = await this.agendaRepository.find({
      relations: ['modalidade'],
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
    const aula = await this.agendaRepository.findOne({
      relations: ['chamada.aluno', 'modalidade.graduacoes'],
      where: {
        id,
        deleted: null,
      },
    });

    const alunos = await this.alunosGraduacaoService.find({
      relations: ['aluno', 'graduacao'],
      where: { modalidadesId: aula.modalidadesId },
    });

    return { aula, alunos };
  }

  async criar(body: any): Promise<boolean> {
    if (body.id) {
      await this.agendaRepository.update(body.id, {
        dataInicio: new Date(`${body.data} ${body.inicio}`),
        dataFinal: new Date(`${body.data} ${body.fim}`),
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

    await Promise.all(
      datas.map(async (item) => {
        await this.agendaRepository.save(item);
      }),
    );

    return true;
  }

  async delete(id: string) {
    await this.agendaRepository.delete(id);

    return true;
  }

  async proximos(academiaId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const aulas = await this.agendaRepository.find({
      relations: ['modalidade'],
      order: {
        dataInicio: 'asc',
      },
      where: {
        academiasId: String(academiaId),
        deleted: null,
        dataInicio: Between(startOfDay, endOfDay),
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
