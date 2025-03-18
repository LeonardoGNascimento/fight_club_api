import { Injectable } from '@nestjs/common';
import {
  differenceInDays,
  format,
  getDaysInMonth,
  lastDayOfMonth,
} from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { Alunos } from '../_core/entity/alunos.entity';
import { Between, Repository } from 'typeorm';
import { Cobrancas } from '../_core/entity/cobrancas.entity';
import { TiposCobrancas } from '../_core/entity/tipos-cobrancas.enum';
import { Clientes } from '../_core/entity/clientes.entity';
import { CobrancasCliente } from '../_core/entity/cobrancas-cliente.entity';
import { Precos } from '../_core/entity/precos.entity';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';

@Injectable()
export class CobrancaService {
  constructor(
    @InjectRepository(CobrancasCliente)
    private cobrancasClienteRepository: Repository<CobrancasCliente>,
    @InjectRepository(CobrancasClienteItems)
    private cobrancasClienteItemsRepository: Repository<CobrancasClienteItems>,
    @InjectRepository(Precos)
    private precoRepository: Repository<Precos>,
    @InjectRepository(Clientes)
    private clientesRepository: Repository<Clientes>,
    @InjectRepository(Alunos) private alunosRepository: Repository<Alunos>,
    @InjectRepository(Cobrancas)
    private cobrancasRepository: Repository<Cobrancas>,
  ) {}

  async lancarCobrancasPorAluno(idAluno: string) {
    const alunos = await this.alunosRepository
      .createQueryBuilder('alunos')
      .innerJoinAndSelect('alunos.plano', 'plano')
      .where('alunos.id = :idAluno', { idAluno })
      .andWhere('alunos.deleted IS NULL') // Check if deleted is null
      .andWhere('plano.valor != :valor', { valor: '0' }) // Ensure valor is not '0'
      .getMany();

    const dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate() + 5);

    return await Promise.all(
      alunos.map(async (item) => {
        await this.cobrancasRepository.save({
          tipo: TiposCobrancas.MENSALIDADE,
          valor: Number(item.plano.valor),
          vencimento: dataAtual,
          academiasId: item.academiaId,
          alunosId: item.id,
          dataHora: new Date(),
        });
      }),
    );
  }

  async lancarValor({ clientesId, tipo }: any) {
    const dataAtual = new Date();
    const mes = format(dataAtual, 'MM');
    const anoAtual = format(dataAtual, 'yyyy');
    const ultimoDia = lastDayOfMonth(dataAtual);

    const diasRestantesMes = differenceInDays(ultimoDia, dataAtual);
    const diasDoMes = getDaysInMonth(dataAtual);

    const cliente = await this.clientesRepository.findOne({
      where: { id: clientesId },
    });

    if (!cliente) {
      return;
    }

    if (cliente.desconto >= 100) {
      return;
    }

    let cobranca = await this.cobrancasClienteRepository.findOne({
      where: {
        clientesId,
        deleted: null,
        dataHora: Between(
          new Date(`${anoAtual}-${mes}-01`), // Start of the month
          ultimoDia, // End date (exclusive)
        ),
      },
    });

    if (!cobranca) {
      cobranca = await this.cobrancasClienteRepository.save({
        clientesId,
        vencimento: new Date(),
        dataHora: new Date(),
        pago: false,
      });
    }

    const valor = await this.precoRepository.findOne({
      where: {
        tipo,
      },
    });

    if (!valor) {
      return;
    }

    let precoTotal = valor.valor;

    if (
      ['FINANCEIRO', 'MENSALIDADE', 'PAGAMENTOS', 'CALENDARIO'].includes(tipo)
    ) {
      precoTotal = (valor.valor / diasDoMes) * diasRestantesMes;
    }

    await this.cobrancasClienteItemsRepository.save({
      dataHora: new Date(),
      qtd: 1,
      valor: precoTotal,
      cobrancasClienteId: cobranca.id,
      tipo,
    });
  }
}
