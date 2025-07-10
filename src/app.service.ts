import { Injectable } from '@nestjs/common';
import {
  differenceInDays,
  format,
  getDaysInMonth,
  lastDayOfMonth,
} from 'date-fns';
import { Precos } from './_core/entity/precos.entity';
import { Between, LessThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CobrancasClienteItemsTipo } from './_core/entity/cobrancas-cliente-items-tipo.enum';
import { Clientes } from './_core/entity/clientes.entity';
import { CobrancasCliente } from './_core/entity/cobrancas-cliente.entity';
import { ClienteModulos } from './_core/entity/cliente-modulos.entity';
import { CobrancasClienteItems } from './_core/entity/cobrancas-cliente-items.entity';
import { Cobrancas } from './_core/entity/cobrancas.entity';
import { Alunos } from './_core/entity/alunos.entity';
import { Modalidades } from './_core/entity/modalidades.entity';
import { Planos } from './_core/entity/planos.entity';
import { Agendas } from './_core/entity/agendas.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Planos)
    private planosRepository: Repository<Planos>,
    @InjectRepository(Agendas)
    private agendasRepository: Repository<Agendas>,
    @InjectRepository(Alunos)
    private alunosRepository: Repository<Alunos>,
    @InjectRepository(Modalidades)
    private modalidadesRepository: Repository<Modalidades>,
    @InjectRepository(Cobrancas)
    private cobrancasRepository: Repository<Cobrancas>,
    @InjectRepository(ClienteModulos)
    private clienteModulosRepository: Repository<ClienteModulos>,
    @InjectRepository(Precos) private precosRepository: Repository<Precos>,
    @InjectRepository(Clientes)
    private clientesRepository: Repository<Clientes>,
    @InjectRepository(CobrancasCliente)
    private cobrancasClienteRepository: Repository<CobrancasCliente>,
    @InjectRepository(CobrancasClienteItems)
    private cobrancasClienteItemsRepository: Repository<CobrancasClienteItems>,
  ) {}

  async cobrar() {
    const clientes = await this.clientesRepository.find({
      where: {
        deleted: null,
        desconto: Not(100),
      },
    });

    const dataAtual = new Date();
    const mes = format(dataAtual, 'MM');
    const anoAtual = format(dataAtual, 'yyyy');
    const ultimoDia = lastDayOfMonth(dataAtual);

    for (const cliente of clientes) {
      let cobranca = await this.cobrancasClienteRepository.findOne({
        where: {
          cliente: {
            id: cliente.id,
          },
          deleted: null,
          dataHora: Between(
            new Date(`${anoAtual}-${mes}-01`), // Start of the month
            ultimoDia, // End date (exclusive)
          ),
        },
      });
      if (!cobranca) {
        cobranca = await this.cobrancasClienteRepository.save({
          clientesId: cliente.id,
          vencimento: new Date(),
          dataHora: new Date(),
          pago: false,
        });
      }

      const precoAluno = await this.precosRepository.findOne({
        where: {
          tipo: CobrancasClienteItemsTipo.ALUNO,
        },
      });

      const precoModalidade = await this.precosRepository.findOne({
        where: {
          tipo: CobrancasClienteItemsTipo.MODALIDADE,
        },
      });

      const precoPlano = await this.precosRepository.findOne({
        where: {
          tipo: CobrancasClienteItemsTipo.PLANO,
        },
      });

      const modulos = await this.clienteModulosRepository.find({
        where: {
          cliente: {
            id: cliente.id,
          },
          dataVencimento: null,
        },
      });

      const diasRestantesMes = differenceInDays(ultimoDia, dataAtual);
      const diasDoMes = getDaysInMonth(dataAtual);

      await Promise.all(
        modulos.map(async (modulo) => {
          const jaCobrado = await this.cobrancasClienteItemsRepository.findOne({
            where: {
              cobrancasCliente: {
                id: cobranca.id,
              },
              tipo: modulo.modulo,
            },
          });

          if (jaCobrado) {
            return;
          }

          const preco = await this.precosRepository.findOne({
            where: {
              tipo: modulo.modulo,
            },
          });

          if (preco) {
            await this.cobrancasClienteItemsRepository.save({
              dataHora: new Date(),
              qtd: 1,
              valor: (preco.valor / diasDoMes) * diasRestantesMes,
              cobrancasClienteId: cobranca.id,
              tipo: modulo.modulo,
            });
          }
        }),
      );

      if (precoModalidade) {
        const qtdModalidadesJaLancados =
          await this.cobrancasClienteItemsRepository
            .find({
              where: {
                cobrancasCliente: {
                  id: cobranca.id,
                },
                tipo: CobrancasClienteItemsTipo.MODALIDADE,
                deleted: null,
              },
            })
            .then((itens) =>
              itens.reduce((prev, curr) => {
                return prev + curr.qtd;
              }, 0),
            );

        const qtdModalidades = await this.modalidadesRepository.count({
          where: {
            academia: {
              cliente: {
                id: cliente.id,
              },
            },
            deleted: null,
          },
        });

        const qtdModalidadesParaLancar =
          qtdModalidades - qtdModalidadesJaLancados;

        if (qtdModalidadesParaLancar > 0) {
          await this.cobrancasClienteItemsRepository.save({
            dataHora: new Date(),
            qtd: qtdModalidadesParaLancar,
            valor: qtdModalidadesParaLancar * Number(precoModalidade.valor),
            cobrancasClienteId: cobranca.id,
            tipo: CobrancasClienteItemsTipo.MODALIDADE,
          });
        }
      }

      if (precoPlano) {
        const itens = await this.cobrancasClienteItemsRepository.find({
          where: {
            cobrancasCliente: {
              id: cobranca.id,
            },
            tipo: CobrancasClienteItemsTipo.PLANO,
            deleted: null,
          },
        });

        const qtdPlanoJaLancados = itens.reduce((prev, curr) => {
          return prev + curr.qtd;
        }, 0);

        const qtdPlano = await this.planosRepository.count({
          where: {
            academia: {
              cliente: {
                id: cliente.id,
              },
            },
            deleted: null,
          },
        });

        const qtdParaLancar = qtdPlano - qtdPlanoJaLancados;

        if (qtdParaLancar > 0) {
          await this.cobrancasClienteItemsRepository.save({
            dataHora: new Date(),
            qtd: qtdPlano - qtdPlanoJaLancados,
            valor: (qtdPlano - qtdPlanoJaLancados) * Number(precoPlano.valor),
            cobrancasClienteId: cobranca.id,
            tipo: CobrancasClienteItemsTipo.PLANO,
          });
        }
      }

      if (precoAluno) {
        const itens = await this.cobrancasClienteItemsRepository.find({
          where: {
            cobrancasCliente: {
              id: cobranca.id,
            },
            tipo: CobrancasClienteItemsTipo.ALUNO,
            deleted: null,
          },
        });

        const qtdAlunosJaLancados = itens.reduce((prev, curr) => {
          return prev + curr.qtd;
        }, 0);
        const qtdAlunos = await this.alunosRepository.count({
          where: {
            academia: {
              cliente: {
                id: cliente.id,
              },
            },
            deleted: null,
          },
        });

        const qtdModalidadesParaLancar = qtdAlunos - qtdAlunosJaLancados;

        if (qtdModalidadesParaLancar > 0) {
          await this.cobrancasClienteItemsRepository.save({
            dataHora: new Date(),
            qtd: qtdAlunos - qtdAlunosJaLancados,
            valor: (qtdAlunos - qtdAlunosJaLancados) * Number(precoAluno.valor),
            cobrancasClienteId: cobranca.id,
            tipo: CobrancasClienteItemsTipo.ALUNO,
          });
        }
      }
    }
  }

  async proximos(academiaId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const aulas = await this.agendasRepository.find({
      where: {
        academia: {
          cliente: {
            id: academiaId,
          },
        },
        dataInicio: Between(startOfDay, endOfDay), // Filter by date range
        deleted: null,
      },
      relations: ['modalidade'], // Include the related 'modalidade' entity
      order: {
        dataInicio: 'ASC', // Order by 'dataInicio' in ascending order
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

  async atrasadas(clienteId: string): Promise<Cobrancas[]> {
    return await this.cobrancasRepository.find({
      where: {
        pago: false,
        deleted: null,
        academia: {
          cliente: {
            id: clienteId,
          },
        },
        vencimento: LessThan(new Date()), // Equivalent to `lt: new Date()`
      },
      relations: ['aluno', 'aluno.plano'], // Include the nested relations
    });
  }

  async dashboardAlunos(alunoId: string) {
    const data = await this.alunosRepository.findOne({
      relations: {
        alunosGraducaoHistorico: {
          graduacao: true,
          modalidade: {
            graduacoes: true,
          },
        },
      },
      where: {
        id: alunoId,
      },
    });

    const graduacaoAtual = data.alunosGraducaoHistorico
      .sort((a, b) => a.graduacao.ordem - b.graduacao.ordem)
      .at(-1);
    const total = graduacaoAtual.modalidade.graduacoes.length;

    const eventos = await this.agendasRepository.find({
      where: {
        modalidade: {
          id: graduacaoAtual.modalidade.id,
        },
      },
    });

    return {
      ...data,
      graduacaoAtual: graduacaoAtual.graduacao,
      eventos,
      diasNaFaixa: differenceInDays(new Date(), graduacaoAtual.dataHora),
      totalGraducoes: total,
    };
  }

  async prejuiso(clienteId: string) {
    const resultado = await this.cobrancasRepository
      .createQueryBuilder('cobranca')
      .select('SUM(cobranca.valor)', 'sum') // Calculate the sum of 'valor'
      .innerJoin('cobranca.academia', 'academia') // Join with 'academia' to filter by 'cliente'
      .innerJoin('academia.cliente', 'cliente') // Join with 'cliente' to filter by 'clienteId'
      .where('cobranca.pago = :pago', { pago: false })
      .andWhere('cobranca.deleted IS NULL')
      .andWhere('cobranca.vencimento < :currentDate', {
        currentDate: new Date(),
      })
      .andWhere('cliente.id = :clienteId', { clienteId })
      .getRawOne(); // Get the result as raw data

    // Accessing the sum
    return resultado ? resultado.sum : 0;
  }

  async mensalidade(clientesId: string) {
    // const cache = await this.cache.get(`${clientesId}:dashboard-mensalidade`);

    // if (cache) {
    //   return cache;
    // }

    const dataAtual = new Date();
    const mes = format(dataAtual, 'MM');
    const anoAtual = format(dataAtual, 'yyyy');
    const ultimoDia = lastDayOfMonth(dataAtual);

    const valor = await this.cobrancasClienteItemsRepository
      .createQueryBuilder('item')
      .select('SUM(item.valor)', 'sum') // Calculate the sum of `valor`
      .innerJoin('item.cobrancasCliente', 'cobranca') // Join with CobrancasCliente to filter by clientesId
      .where('item.deleted IS NULL') // Ensure the item is not deleted
      .andWhere('cobranca.clientesId = :clientesId', { clientesId }) // Filter by clientesId
      .andWhere('item.dataHora >= :startDate', {
        startDate: new Date(`${anoAtual}-${mes}-01`),
      }) // Start date condition
      .andWhere('item.dataHora < :endDate', { endDate: ultimoDia }) // End date condition
      .getRawOne(); // Retrieve the result as raw data

    // await this.cache.set(`${clientesId}:dashboard-mensalidade`, valor['_sum'].valor, 3600);

    return valor ? valor.sum : 0;
  }
}
