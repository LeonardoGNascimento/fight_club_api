import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CobrancasCliente } from '../_core/entity/cobrancas-cliente.entity';
import { Repository } from 'typeorm';
import { CobrancasClienteItems } from '../_core/entity/cobrancas-cliente-items.entity';

@Injectable()
export class AbacatePayService {
  constructor(
    @InjectRepository(CobrancasCliente)
    private cobrancasRepository: Repository<CobrancasCliente>,
    @InjectRepository(CobrancasClienteItems)
    private cobrancasItemsRepository: Repository<CobrancasClienteItems>,
    @InjectRepository(CobrancasCliente)
    private cobrancasClienteRepository: Repository<CobrancasCliente>,
  ) {}

  async gerarPix(id: string) {
    const mensalidade = await this.cobrancasRepository.findOne({
      where: {
        id,
      },
    });

    const preco = await this.cobrancasItemsRepository.find({
      where: {
        cobrancasCliente: {
          id
        }
      },
    });

    const data = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      body: JSON.stringify({
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        customerId: 'cust_FzgSPu3DQkYMxEYU54bgLxGX',
        products: [
          {
            externalId: `mensalidade:${mensalidade.id}`,
            name: 'Cobrança mensal uso app',
            quantity: 1,
            price: preco.reduce((acc, cur) => acc + cur.valor, 0),
          },
        ],
        returnUrl: 'https://dojoplanner.legana.com.br/mensalidade',
        completionUrl: 'https://dojoplanner.legana.com.br/mensalidade',
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer abc_dev_ywCuQLmMGZ21tRFtkPsWksCY`,
      },
    });
    return await data.json();
  }

  async baixa(id: string) {
    await this.cobrancasClienteRepository.update(id.split(':')[1], {
      pago: true,
    });
  }
}
