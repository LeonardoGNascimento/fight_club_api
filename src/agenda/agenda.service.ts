import { Injectable } from '@nestjs/common';
import {
  addDays,
  endOfMonth,
  endOfYear,
  format,
  getMonth,
  getYear,
  startOfYear,
} from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Agendas } from '../_core/entity/agendas.entity';
import { AlunosGraducaoHistorico } from '../_core/entity/alunos-graducao-historico.entity';
import { Chamada } from 'src/_core/entity/chamada.entity';
import { ptBR } from 'date-fns/locale';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agendas) private agendaRepository: Repository<Agendas>,
    @InjectRepository(Chamada) private chamadaRepository: Repository<Chamada>,
    @InjectRepository(AlunosGraducaoHistorico)
    private alunosGraduacaoService: Repository<AlunosGraducaoHistorico>,
  ) {}

  async buscarFrequencia(id: string) {
    const anoAtual = new Date();
    const mesAtual = getMonth(anoAtual) + 1
    console.log(mesAtual);
    
    const inicioAno = startOfYear(anoAtual);
    const fimAno = endOfYear(anoAtual);

    const data = await this.agendaRepository.find({
      where: {
        dataInicio: Between(inicioAno, fimAno),
        dataFinal: Between(inicioAno, fimAno),
        modalidade: {
          id: '6a34c98f-d98f-4327-9ab3-6b51af4f7131',
        },
      },
    });

    const totalFrequencia = await this.chamadaRepository.find({
      relations: {
        agenda: true,
      },
      where: {
        agenda: In(data.map((item) => item.id)),
        aluno: {
          id: id,
        },
      },
    });

    const meses = new Map<
      number,
      { presencas: number; faltas: number; total: number }
    >();

    for (let i = 0; i < mesAtual; i++) {
      meses.set(i, { presencas: 0, faltas: 0, total: 0 });
    }

    data.forEach((item) => {
      const mes = getMonth(item.dataInicio);
      const presencas = totalFrequencia.filter(
        (presenca) => presenca.agenda.id === item.id,
      ).length;
      const totalMes = (meses.get(mes)?.total || 0) + 1;

      meses.set(mes, {
        presencas: (meses.get(mes)?.presencas || 0) + presencas,
        faltas: totalMes - (meses.get(mes)?.presencas || 0) - presencas,
        total: totalMes,
      });
    });

    return Array.from(meses.entries()).map(([mes, valores]) => ({
      mes: format(new Date(anoAtual.getFullYear(), mes, 1), 'MMMM', {
        locale: ptBR,
      }),
      presencas: valores.presencas,
      faltas: valores.faltas,
      total: valores.total,
    }));
  }

  async listar(academiaId: string): Promise<Agendas[]> {
    const aulas = await this.agendaRepository.find({
      relations: ['modalidade'],
      where: {
        academia: {
          id: academiaId,
        },
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
      where: { modalidade: { id: aula.modalidade.id } },
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
        academia: {
          id: academiaId,
        },
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
