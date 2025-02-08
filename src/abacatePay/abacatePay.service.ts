import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/_core/prisma.service';

@Injectable()
export class AbacatePayService {
  constructor(private prisma: PrismaService) {}

  async gerarPix(id: string) {
    const mensalidade = await this.prisma.cobrancasCliente.findFirst({
      where: {
        id,
      },
    });

    const preco = await this.prisma.cobrancasClienteItems.findMany({
      where: {
        cobrancasClienteId: id,
      },
    });

    const data = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      body: JSON.stringify({
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        customerId: 'cust_4RY6zKnpB5bytRjRe31N2k5k',
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
    await this.prisma.cobrancasCliente.update({
      where: {
        id: id.split(':')[1],
      },
      data: {
        pago: true,
      },
    });
  }
}
